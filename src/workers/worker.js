onmessage = (event) => {
  console.info('Message received by Worker', event);
  const ts = new Date().getTime();
  postMessage(`Thanks for the data! (${ts})`);
  close();
};