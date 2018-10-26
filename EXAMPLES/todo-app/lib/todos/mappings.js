module.exports = {
  mapToTodo,
};

function mapToTodo(doc) {
  const { _id: id, description, done = false } = doc;

  return { done, id, description };
}
