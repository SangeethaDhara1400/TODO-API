const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

let bdTodoObjectToResponsiveToDoObject = (each) => {
  return {
    id: each.id,
    todo: each.todo,
    priority: each.priority,
    status: each.status,
  };
};

//API-1:
//SCENARIO1

app.get("/todos/?status=TO%20DO", async (request, response) => {
  const { status } = request.query;
  const getToDoQuery = `
    SELECT
      todo
    FROM
      todo
    WHERE status LIKE '%${status}%';`;
  const todoArray = await db.all(getToDoQuery);
  response.send(todoArray.map(bdTodoObjectToResponsiveToDoObject(each)));
});

//SCENARIO2

app.get("/todos/?priority=HIGH", async (request, response) => {
  const { priority } = request.query;
  const getToDoQuery = `
    SELECT
      todo
    FROM
      todo
    WHERE priority LIKE '%${priority}%';`;
  const todoArray = await db.all(getToDoQuery);
  response.send(todoArray.map(bdTodoObjectToResponsiveToDoObject(each)));
});

//SCENARIO3

app.get(
  "/todos/?priority=HIGH&status=IN%20PROGRESS",
  async (request, response) => {
    const { priority, status } = request.query;
    const getToDoQuery = `
    SELECT
      todo
    FROM
      todo
    WHERE priority LIKE '%${priority}%' AND status LIKE '%${status}%';`;
    const todoArray = await db.all(getToDoQuery);
    response.send(todoArray.map(bdTodoObjectToResponsiveToDoObject(each)));
  }
);

//SCENARIO4

app.get("/todos/?search_q=Play", async (request, response) => {
  const { search_q } = request.query;
  const getToDoQuery = `
    SELECT
      todo
    FROM
      todo
    WHERE todo LIKE '%${search_q}%';`;
  const todoArray = await db.all(getToDoQuery);
  response.send(todoArray.map(bdTodoObjectToResponsiveToDoObject(each)));
});

//API2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getToDoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
      id = ${todoId};`;
  const todoItem = await db.get(getToDoQuery);
  response.send(todoTtem);
});

//API3
app.post("/todos/", async (request, response) => {
  const TODODetails = request.body;
  const { id, todo, priority, status } = todoDetails;
  const addTodoQuery = `
    INSERT INTO
      todo (id, todo, priority, status)
    VALUES
      (
        ${id},
        '${todo}',
        '${priority}',
        '${status}'
      );`;

  const dbResponse = await db.run(addToDoQuery);

  response.send("Todo Successfully Added");
});

//API4

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { status } = todoDetails;

  const updateToDoQuery = `
    UPDATE
      todo
    SET
      status='${status}'
    WHERE
      id = ${todoId};`;
  await db.run(updateToDoQuery);
  response.send("Status Updated");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { priority } = todoDetails;

  const updateToDoQuery = `
    UPDATE
      todo
    SET
      priority='${priority}'
    WHERE
      id = ${todoId};`;
  await db.run(updateToDoQuery);
  response.send("Priority Updated");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { todo } = todoDetails;

  const updateToDoQuery = `
    UPDATE
      todo
    SET
      todo LIKE '${todo}'
    WHERE
      id = ${todoId};`;
  await db.run(updateToDoQuery);
  response.send("Todo Updated");
});

//API5

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteToDoQuery = `
    DELETE FROM
      todo
    WHERE
      id = ${todoId};`;
  await db.run(deleteToDoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
