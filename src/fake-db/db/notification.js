import shortId from "shortid";
import Mock from "../mock";

const NotificationDB = {
  list: [
    {
      id: shortId.generate(),
      heading: "Message",
      icon: {
        name: "chat",
        color: "primary",
      },
      
      title: "New message from Ai Team",
      subtitle: "We will be sending you results...",
      path: "chat",
    },
    {
      id: shortId.generate(),
      heading: "Alert",
      icon: {
        name: "notifications",
        color: "error",
      },
      
      title: "Token Limit reached",
      subtitle: "Set Token Limit crossed",
      path: "page-layouts/user-profile",
    },
    {
      id: shortId.generate(),
      heading: "Message",
      icon: {
        name: "chat",
        color: "primary",
      },
      
      title: "New message from AI Team",
      subtitle: "Hello, Your Request is Approved",
      path: "chat",
    },
  ],
};

Mock.onGet("/api/notification").reply((config) => {
  const response = NotificationDB.list;
  return [200, response];
});

Mock.onPost("/api/notification/add").reply((config) => {
  const response = NotificationDB.list;
  return [200, response];
});

Mock.onPost("/api/notification/delete").reply((config) => {
  let { id } = JSON.parse(config.data);
  console.log(config.data);

  const response = NotificationDB.list.filter((notification) => notification.id !== id);
  NotificationDB.list = [...response];
  return [200, response];
});

Mock.onPost("/api/notification/delete-all").reply((config) => {
  NotificationDB.list = [];
  const response = NotificationDB.list;
  return [200, response];
});
