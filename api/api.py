from flask import Flask, request, jsonify
import requests
from requests.auth import HTTPBasicAuth
from flask_cors import CORS, cross_origin
import json
import pandas as pd
from transformers import GPT2Tokenizer
from google.cloud import bigquery
import os
import subprocess
import signal
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import numpy as np

app = Flask(__name__)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/Users/prabhdeepsinghgill/Downloads/matx-react-pro-v3.6.0 2/api/demoproject-406702-594f27b0e307.json'
bigquery_client = bigquery.Client()

# Enable CORS for all origins
CORS(app, supports_credentials=True)

@app.route('/create-jira-issue', methods=['POST', 'OPTIONS'])
@cross_origin()
def create_jira_issue():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight request allowed'}), 200
    
    data=request.json
    description=data.get('description','No description provided')

    url = "https://arshdeepgill01.atlassian.net/rest/api/3/issue"

    # Your Jira account email and API token
    email = "arshdeep.gill01@gmail.com"
    api_token = "ATATT3xFfGF065xS9gFoGtCC1zpe37AqrojqSjxi1ikUla53CEjHihOjnqBzP1aHwiU6D6xjBXNoesQk-nsRfEI8qbugVV6ZuLLXMPzIaD_v001V7ZjsmD1auPxAperY-dnwqQ7UnUdmNpa15WWiGIOLSWe0D6LxnkyWFqm2rRavxVUiRs11Glo=61CF6849"

    # Jira issue data
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    payload = json.dumps({
    "fields": {
        "project": {
            "key": "KAN"  # Replace with your Jira project key
        },
        "summary": "FineTune-Request By Customer",  # Issue summary
        "description": {
            "type": "doc",
            "version": 1,
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "text": description,
                            "type": "text"
                        }
                    ]
                }
            ]
        },  # Issue description in Atlassian Document Format
        "issuetype": {
            "name": "Task"  # Issue type, e.g., Task, Bug, Story
        }
        # Add other fields as needed
    }
})

    response = requests.post(url, data=payload, headers=headers,
                             auth=HTTPBasicAuth(email, api_token))

    # Check for request success
    if response.status_code == 201:
        print("Successfully created Jira issue:", response.json())
        return response.json()
    else:
        print("Failed to create Jira issue:", response.content)
        return None
    
@app.route('/get-jira-issue/<issue_id_or_key>', methods=['GET','OPTIONS'])
@cross_origin()  
def get_jira_issue(issue_id_or_key):
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight request allowed'}), 200

    email = "arshdeep.gill01@gmail.com"
    api_token = "ATATT3xFfGF065xS9gFoGtCC1zpe37AqrojqSjxi1ikUla53CEjHihOjnqBzP1aHwiU6D6xjBXNoesQk-nsRfEI8qbugVV6ZuLLXMPzIaD_v001V7ZjsmD1auPxAperY-dnwqQ7UnUdmNpa15WWiGIOLSWe0D6LxnkyWFqm2rRavxVUiRs11Glo=61CF6849"
    jira_domain = "https://arshdeepgill01.atlassian.net"

    url = f"{jira_domain}/rest/api/3/issue/{issue_id_or_key}"
    auth = HTTPBasicAuth(email, api_token)
    headers = {"Accept": "application/json"}

    response = requests.get(url, headers=headers, auth=auth)
    

    if response.status_code == 200:
        response_data = response.json()
        #print(response_data)
        assignee = response_data['fields'].get('assignee')
        assignee_name = assignee['displayName'] if assignee else ''
        updated = response_data['fields'].get('updated', 'No update info available')
        status = response_data['fields']['status']['name']  # Extracting status
        comments = [comment['body']['content'][0]['content'][0]['text'] for comment in response_data['fields']['comment']['comments']]  # Extracting comments
        
        issue_details = {
            "assignee": assignee_name,
            "last_updated": updated,
            "status":status,
            "comments":comments
        }
        print(issue_details)
        return jsonify(issue_details)
    else:
        return jsonify({"error": f"Error retrieving issue details: {response.status_code}"}), response.status_code

@app.route('/upload', methods=['POST'])
@cross_origin()  
def upload_file():
    file = request.files['file']
    if file.filename.endswith('.csv'):
        df = pd.read_csv(file)
        columns = df.columns.tolist()
        return jsonify({"type": "csv", "columns": columns})
    elif file.filename.endswith('.json'):
        data = json.load(file)
        keys = list(data[0].keys()) if isinstance(data, list) else list(data.keys())
        return jsonify({"type": "json", "keys": keys})
    else:
        return "Invalid file format", 400
    

@app.route('/tokenize-check', methods=['POST'])
@cross_origin() 
def tokenize_check():
    file = request.files['file']
    prompt_field = request.form['prompt']
    instruct_field = request.form['instruct']
    max_length = 4096  # Adjust as needed

    print("File received:", file.filename)
    print("Prompt field:", prompt_field)
    print("Instruct field:", instruct_field)

    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

    if file.filename.endswith('.csv'):
        print("Processing CSV file")
        df = pd.read_csv(file)
        print(df.head)
        print(df.columns)
        print(prompt_field,instruct_field)
        if prompt_field not in df.columns or instruct_field not in df.columns:
            print("Invalid prompt or instruct field in CSV")
            return "Invalid prompt or instruct field", 400
        combined_text = df[prompt_field] + " " + df[instruct_field]

    elif file.filename.endswith('.json'):
        print("Processing JSON file")
        data = json.load(file)
        if not all(field in data[0] for field in [prompt_field, instruct_field]):
            print("Invalid prompt or instruct field in JSON")
            return "Invalid prompt or instruct field", 400
        combined_text = [entry[prompt_field] + " " + entry[instruct_field] for entry in data]

    else:
        print("Invalid file format")
        return "Invalid file format", 400

    tokenized = [tokenizer.tokenize(text) for text in combined_text]
    length_exceeded = any(len(tokens) > max_length for tokens in tokenized)

    if length_exceeded:
        print("Entries exceed maximum token length")
        return "Entries exceed maximum token length", 400

    print("Data is validated")
    return "Data is validated", 200

@app.route('/data-preprocessing', methods=['POST'])
@cross_origin() 
def data_preprocessing():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Check file extension and load data accordingly
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith('.json'):
            json_data = json.load(file)
            df = pd.json_normalize(json_data)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        # Data quality checks
        df.dropna(inplace=True)  # Remove empty entries
        df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)  # Trim whitespace

        for col in df.columns:
            df[col] = df[col].astype(str).str.encode('utf-8').str.decode('ascii', 'ignore')

        df.drop_duplicates(inplace=True)  # De-duplication

        # Convert DataFrame to appropriate format for response
        if file.filename.endswith('.csv'):
            result = df.to_csv(index=False)
        else:
            result = df.to_json(orient='records')

        steps_completed = {
            "removeEmptyEntries": True,
            "trimWhitespace": True,
            "deDuplication": True
        }
        return jsonify({"message": "Data processed successfully", "steps": steps_completed}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/add-finetune-details', methods=['POST'])
@cross_origin()
def add_finetune_details():
    data = request.json
    print(data)

    # Prepare the data for insertion into BigQuery
    rows_to_insert = [
        {
            'User_ID': data['User_ID'],  # Or dynamically from data['User_ID']
            'Model': data['model'],
            'Epochs': data['epochs'],
            'BatchSize': data['batchSize'],
            'LearningRate': data['learningRate'],
            'EarlyStopping': data['earlyStopping'],
            'DataSet': data['dataset'],
            'FineTune_ID': data['FineTune_ID'],
            'Description':data['description'],
            'Status':data['Status'],
            "DateSubmitted":data['date']
        }
    ]

    table_id = 'demoproject-406702.FineTune.FineTune'

    # Insert data into BigQuery
    errors = bigquery_client.insert_rows_json(table_id, rows_to_insert)
    if errors == []:
        return jsonify({'message': 'Data inserted into BigQuery successfully'}), 200
    else:
        return jsonify({'message': 'Failed to insert data into BigQuery', 'errors': errors}), 500

@app.route('/update-finetune-details', methods=['POST'])
@cross_origin()
def update_finetune_details():
    data = request.json
    print(data)

    table_id = 'demoproject-406702.FineTune.FineTune'
    fine_tune_id = data['FineTune_ID']
    new_status = data['Status']

   
    query = f"""
        UPDATE `{table_id}`
        SET Status = @new_status
        WHERE FineTune_ID = @fine_tune_id
    """

   
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("new_status", "STRING", new_status),
            bigquery.ScalarQueryParameter("fine_tune_id", "STRING", fine_tune_id),
        ]
    )

    # Execute the query
    query_job = bigquery_client.query(query, job_config=job_config)
    query_job.result()  # Wait for the job to complete

    if query_job.errors is None:
        return jsonify({'message': 'Status updated in BigQuery successfully'}), 200
    else:
        return jsonify({'message': 'Failed to update status in BigQuery', 'errors': query_job.errors}), 500
    
@app.route('/get-finetune-requests', methods=['GET'])
@cross_origin()
def get_finetune_requests():
    # Extract user ID from query parameters
    user_id = request.args.get('userId')

    if not user_id:
        return jsonify({"error": "No user ID provided"}), 400

    # Parameterized SQL query to prevent SQL injection
    query = """
        SELECT *
        FROM `demoproject-406702.FineTune.FineTune`
        WHERE User_ID = @user_id
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("user_id", "STRING", user_id)
        ]
    )

    query_job = bigquery_client.query(query, job_config=job_config)

    # Wait for the query to finish
    results = query_job.result()

    # Convert results to a list of dictionaries
    requests = [dict(row) for row in results]
    print(requests)
    return jsonify(requests)

tensorboard_process = None
def stop_tensorboard():
    global tensorboard_process
    if tensorboard_process:
        os.killpg(os.getpgid(tensorboard_process.pid), signal.SIGTERM)
        tensorboard_process = None

@app.route('/start-tensorboard', methods=['GET'])
@cross_origin()  # Allows cross-origin requests (needed for your React app to communicate with Flask)
def start_tensorboard():
    global tensorboard_process
    stop_tensorboard()  # Stop any running TensorBoard instances

    logdir = "/Users/prabhdeepsinghgill/Downloads/matx-react-pro-v3.6.0 2/api/logs"  # Get logdir from request, default to 'logs/fit'
    tensorboard_command = ['tensorboard', '--logdir', logdir, '--port', '6006']
    tensorboard_process = subprocess.Popen(tensorboard_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, preexec_fn=os.setsid)

    return jsonify({"message": "TensorBoard started", "logdir": logdir})

def calculate_embedding_similarity(train_df, validation_df):
    # Concatenate 'prompt' and 'response' columns for both datasets to create a single text column
    train_texts = train_df['prompt'] + ' ' + train_df['response']
    validation_texts = validation_df['prompt'] + ' ' + validation_df['response']
    
    # Load a pre-trained sentence transformer model
    model = SentenceTransformer('all-mpnet-base-v2')
    
    # Encode the sentences to get the embeddings
    train_embeddings = model.encode(train_texts.tolist(), show_progress_bar=True)
    validation_embeddings = model.encode(validation_texts.tolist(), show_progress_bar=True)
    
    # Calculate the cosine similarities
    cos_similarities = cosine_similarity(validation_embeddings, train_embeddings)
    
    # Find the maximum similarity for each validation embedding
    max_similarities = np.max(cos_similarities, axis=1)
    
    # Calculate the average of the maximum similarities
    average_max_similarity = np.mean(max_similarities)
    
    return average_max_similarity

@app.route('/calculate-similarity', methods=['POST'])
@cross_origin()
def similarity_endpoint():

    print("i am testing ---------------------------this code")


    training_dataset = request.files['trainingDataset']
    validation_dataset = request.files['validationDataset']
    print(validation_dataset)


    try:
        train_df = pd.read_csv(training_dataset)
        validation_df = pd.read_csv(validation_dataset)
    except pd.errors.ParserError as e:
        return jsonify({'error': str(e)}), 400

    similarity_score = calculate_embedding_similarity(train_df, validation_df)
    return jsonify({'similarity_score': similarity_score})


if __name__ == '__main__':
    app.run(debug=True)