const { app } = require('./app');
const port = 80;

app.listen(port, () => {
    global.logger.info(`listening ${port}`);
});