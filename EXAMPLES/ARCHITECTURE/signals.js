process.stdin.resume();

// Control-C (SIGINT)
process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// killall -HUP node
process.on('SIGHUP', () => {
  console.log('Received SIGHUP. ');
  console.log('Graceful shutdown ... 10 seconds.');
  setTimeout(() => {
    console.log('EXIT(2)');
    process.exit(2);
  }, 10000);
});

// killall -TERM node
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. ');
  console.log('Graceful shutdown ... 10 seconds.');
  setTimeout(() => {
    console.log('EXIT(1)');
    process.exit(1);
  }, 10000);
});
