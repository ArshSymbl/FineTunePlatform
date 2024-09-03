const createJiraIssue = (issueDetails) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = 'https://arshdeepgill01.atlassian.net/rest/api/3/issue';
    const email = 'arshdeep.gill01@gmail.com';
    const apiToken = 'ATATT3xFfGF065xS9gFoGtCC1zpe37AqrojqSjxi1ikUla53CEjHihOjnqBzP1aHwiU6D6xjBXNoesQk-nsRfEI8qbugVV6ZuLLXMPzIaD_v001V7ZjsmD1auPxAperY-dnwqQ7UnUdmNpa15WWiGIOLSWe0D6LxnkyWFqm2rRavxVUiRs11Glo=61CF6849';

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Basic ${btoa(`${email}:${apiToken}`)}`);
    xhr.setRequestHeader('X-Atlassian-Token', 'no-check');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(`Error: ${xhr.status} - ${xhr.statusText}`);
        }
      }
    };

    const payload = {
      fields: {
        project: {
          key: 'KAN',
        },
        summary: issueDetails.summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  text: issueDetails.description,
                  type: 'text'
                }
              ]
            }
          ]
        },
        issuetype: {
          name: 'Task'
        }
        // Add other fields as needed
      }
    };

    xhr.send(JSON.stringify(payload));
  });
};

export default createJiraIssue;
