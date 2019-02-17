const app = require('./app');

// const port = '9090';

// app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });

const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`listening on ${PORT}`));
