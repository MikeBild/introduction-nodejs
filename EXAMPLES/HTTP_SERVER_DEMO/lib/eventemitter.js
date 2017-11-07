const EventEmitter = require("events");

module.exports = topic => {
  const es = new EventEmitter();

  return {
    publish: payload => publish(es, topic, payload),
    subscribe: callback => subscribe(es, topic, callback),
    count: () => es.listenerCount(topic)
  };
};

function publish(es, topic, payload) {
  es.emit(topic, payload);
}

function subscribe(es, topic, callback) {
  es.on(topic, callback);
  return () => es.removeListener(topic, callback);
}
