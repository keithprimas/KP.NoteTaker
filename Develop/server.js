const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

// Define the path to your db.json file
const dbPath = path.join(__dirname, './db/db.json');

// Use middleware to parse JSON and form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Read the notes from db.json
function readNotes() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Get all notes
app.get('/api/notes', (req, res) => {
  const allNotes = readNotes();
  res.json(allNotes);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Create a new note
app.post('/api/notes', (req, res) => {
  const allNotes = readNotes();
  const newNote = req.body;
  
  // Assign a unique ID (you can use a UUID library for more robust IDs)
  newNote.id = Date.now();

  allNotes.push(newNote);
  fs.writeFileSync(dbPath, JSON.stringify(allNotes, null, 2));
  
  res.json(newNote);
});

// Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);
  const allNotes = readNotes();
  
  const filteredNotes = allNotes.filter(note => note.id !== idToDelete);
  fs.writeFileSync(dbPath, JSON.stringify(filteredNotes, null, 2));
  
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
