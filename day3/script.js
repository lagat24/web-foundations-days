let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  return notes.filter(note =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (let note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}

function countByCategory() {
  let counts = {};

  for (let note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }

  return counts;
}

function getSummary() {
  let counts = countByCategory();
  let total = notes.length;
  let noteWord = total === 1 ? "note" : "notes";

  return `${total} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

function isDuplicate(text) {
  let cleanedText = text.trim().toLowerCase();

  return notes.some(note =>
    note.text.trim().toLowerCase() === cleanedText
  );
}

function addNote(text, category) {
  let cleanedText = text.trim();

  if (cleanedText.length < 1 || cleanedText.length > 200) {
    console.log("Note not added: text must be 1–200 characters.");
    return false;
  }

  if (isDuplicate(cleanedText)) {
    console.log("Note not added: duplicate note.");
    return false;
  }

  if (!["personal", "work", "study"].includes(category)) {
    console.log("Note not added: invalid category.");
    return false;
  }

  let newNote = {
    id: notes.length + 1,
    text: cleanedText,
    category: category,
  };

  notes.push(newNote);
  console.log("Note added successfully.");
  return true;
}


/* Tests */

// searchNotes
console.log(searchNotes("day"));
// Expected: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }]

console.log(searchNotes("pizza"));
// Expected: []

// longestNote
console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

let savedNotes = notes;
notes = [];
console.log(longestNote());
// Expected: null
notes = savedNotes;

// countByCategory
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

notes = [];
console.log(countByCategory());
// Expected: {}
notes = savedNotes;

// getSummary
console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

notes = [
  { id: 1, text: "Only one note", category: "personal" }
];
console.log(getSummary());
// Expected: "1 note: 1 personal, 0 work, 0 study."
notes = savedNotes;

// isDuplicate
console.log(isDuplicate("  Buy milk and bread  "));
// Expected: true

console.log(isDuplicate("Buy eggs"));
// Expected: false

// addNote
console.log(addNote("Read JavaScript documentation", "study"));
// Expected: true

console.log(addNote("  BUY MILK AND BREAD  ", "personal"));
// Expected: false

console.log(addNote("", "work"));
// Expected: false

console.log(addNote("New note", "invalid"));
// Expected: false
