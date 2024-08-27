const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

let phonebook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const onePhonebook = phonebook.find((item) => item.id === id);
  if (onePhonebook) {
    response.json(onePhonebook);
  } else {
    response.status(404).end();
  }
});

app.use(
  morgan(function (tokens, req, res) {
    //  console.log(tokens.req.body);

    const response = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
    console.log(response);
  }),
);

app.post("/api/persons", (request, response) => {
  const person = request.body;
  if (!person?.name || !person?.number) {
    return response.status(400).json({ error: "No Content" });
  }
  const duplicateName = phonebook.find((info) => info.name === person.name);
  if (duplicateName) {
    return response.status(400).json({ error: "name must be unique" });
  }
  const id = Math.floor(Math.random() * 1000000000000);
  const newPerson = { ["id"]: id, ...person };

  phonebook.push(newPerson);
  response.status(201).json(newPerson).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const onePhonebook = phonebook.filter((item) => item.id !== id);
  if (onePhonebook) {
    phonebook = onePhonebook;
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const totalPersons = phonebook.length;
  response.send(
    `<p>Phonebook has info for ${totalPersons} people</p><p>${new Date().toString()}</p>`,
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
