import Mock from "../mock";

const ListDB = {
  list: [


    {
      id: 2,
      modelName: "Model 2",
      description: "Description of Meeting Notes",
      modelImage: "/assets/images/products/symbldotai_cover.jpeg",
      lastUpdated: new Date().toLocaleString(),
    },
    {
      id: 3,
      modelName: "Model 3",
      description: "Description of Realtime Assist",
      modelImage: "/assets/images/products/symbldotai_cover.jpeg",
      lastUpdated: new Date().toLocaleString(),
    },
    {
      id: 4,
      modelName: "Model 4",
      description: "Description of Search",
      modelImage: "/assets/images/products/symbldotai_cover.jpeg",
      lastUpdated: new Date().toLocaleString(),
    },
    {
      id: 5,
      modelName: "Model 5",
      description: "Description of Compliance",
      modelImage: "/assets/images/products/symbldotai_cover.jpeg",
      lastUpdated: new Date().toLocaleString(),
    },
    {
      id: 6,
      modelName: "Model 6",
      description: "Description of Questions and Answers",
      modelImage: "/assets/images/products/symbldotai_cover.jpeg",
      lastUpdated: new Date().toLocaleString(),
    },
    {
      id: 7,
      modelName: "Model 7",
      description: "Description of Intent Detection",
      modelImage: "/assets/images/products/symbldotai_cover.jpeg",
      lastUpdated: new Date().toLocaleString(),
    },
 
  ],
};

Mock.onGet("/api/list/all").reply((config) => {
  const response = ListDB.list;
  return [200, response];
});
