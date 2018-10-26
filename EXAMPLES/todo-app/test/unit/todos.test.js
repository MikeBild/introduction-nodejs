const { deepEqual } = require('assert');

describe('Todo Unit Tests', () => {
  describe('Mapping', () => {
    it('from doc to todo data structure', () => {
      // Arrange
      const sut = require('../../lib/todos/mappings');

      // Act
      const actual = sut.mapToTodo({
        _id: 'foo',
        _rev: 'sksks',
        description: 'bar',
      });

      // Assert
      deepEqual(actual, { id: 'foo', description: 'bar', done: false });
    });
  });
});
