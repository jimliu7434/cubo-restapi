const { app, model, conf } = require('../../index');
const request = require('supertest');
const legalID1 = '5F14A5A8-4A7E-4386-B54F-D01649D33710';
const legalID2 = '5F14A5A8-4A7E-4386-B54F-D01649D33710';
const illegalID1 = 'test-device1';
const illegalID2 = '!#$#@^$%^&^(*&^*(&^*(^%&$#%^^&#';

const { 
    expiredSec,
    checkMin,
} = conf;

const testExpiredSec = expiredSec + (checkMin * 60);

describe('testing /heartbeat', () => {
    test('Using a legal deviceid (UUID) 1', async (done) => {
        const response = await request(app.callback()).post('/getmtkcates').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeArray();
        expect(response.body).not.toBeArrayOfSize(0);
        for (const cate of response.body) {
            expect(cate).toContainKeys([
                'CategoryID',
                'Name',
                'ClientOrder',
                'ClientCmd',
            ]);
            expect(cate.CategoryID).toBeString();
            expect(cate.Name).toBeString();
            expect(cate.ClientOrder).toBeNumber();
            expect(cate.ClientCmd).toBeString();
        }

        done();
    });

    test('Using a legal deviceid (UUID) 2', async (done) => {
        const response = await request(app.callback()).post('/getmtkcates').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeArray();
        expect(response.body).not.toBeArrayOfSize(0);
        for (const cate of response.body) {
            expect(cate).toContainKeys([
                'CategoryID',
                'Name',
                'ClientOrder',
                'ClientCmd',
            ]);
            expect(cate.CategoryID).toBeString();
            expect(cate.Name).toBeString();
            expect(cate.ClientOrder).toBeNumber();
            expect(cate.ClientCmd).toBeString();
        }

        done();
    });


    test('Using an illegal deviceid ', async (done) => {
        const response = await request(app.callback()).post('/getmtkcates').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeArray();
        expect(response.body).not.toBeArrayOfSize(0);
        for (const cate of response.body) {
            expect(cate).toContainKeys([
                'CategoryID',
                'Name',
                'ClientOrder',
                'ClientCmd',
            ]);
            expect(cate.CategoryID).toBeString();
            expect(cate.Name).toBeString();
            expect(cate.ClientOrder).toBeNumber();
            expect(cate.ClientCmd).toBeString();
        }

        done();
    });
});

describe('testing /device', () => {
    test('Using a legal deviceid', async (done) => {
        const response = await request(app.callback()).post('/getcates').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeObject();
        for (const name in response.body) {
            const item = response.body[name];
            expect(item).toBeObject();
            expect(item).toContainKeys([
                'ChannelID',
                'Name',
                'ChannelType',
                'ClientOrder',
                'IsTop',
                'IconUpdateAt',
                'IconUrl',
                'Categories',
            ]);
            expect(item.ChannelID).toBeString();
            expect(item.Name).toBeString();
            expect(item.ChannelType).toBeNumber();
            expect(item.ClientOrder).toBeNumber();
            expect(item.IsTop).toBeNumber();
            expect(item.IconUpdateAt).toBeDefined();
            expect(item.IconUrl).toBeDefined();
            expect(item.Categories).toBeArray();
            for (const cate of item.Categories) {
                expect(cate).toBeObject();
                expect(cate).toContainKeys([
                    'CategoryID',
                    'ChannelID',
                    'Name',
                    'ClientOrder',
                    'ClientCmd',
                ]);
            }
        }

        done();
    });

    test('Using a legal deviceid but never heartbeat', async (done) => {
        const response = await request(app.callback()).post('/getcates').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeObject();
        for (const name in response.body) {
            const item = response.body[name];
            expect(item).toBeObject();
            expect(item).toContainKeys([
                'ChannelID',
                'Name',
                'ChannelType',
                'ClientOrder',
                'IsTop',
                'IconUpdateAt',
                'IconUrl',
                'Categories',
            ]);
            expect(item.ChannelID).toBeString();
            expect(item.Name).toBeString();
            expect(item.ChannelType).toBeNumber();
            expect(item.ClientOrder).toBeNumber();
            expect(item.IsTop).toBeNumber();
            expect(item.IconUpdateAt).toBeDefined();
            expect(item.IconUrl).toBeDefined();
            expect(item.Categories).toBeArray();
            for (const cate of item.Categories) {
                expect(cate).toBeObject();
                expect(cate).toContainKeys([
                    'CategoryID',
                    'ChannelID',
                    'Name',
                    'ClientOrder',
                    'ClientCmd',
                ]);
            }
        }

        done();
    });

    test('Using an illegal deviceid', async (done) => {
        const response = await request(app.callback()).post('/getcates').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeObject();
        for (const name in response.body) {
            const item = response.body[name];
            expect(item).toBeObject();
            expect(item).toContainKeys([
                'ChannelID',
                'Name',
                'ChannelType',
                'ClientOrder',
                'IsTop',
                'IconUpdateAt',
                'IconUrl',
                'Categories',
            ]);
            expect(item.ChannelID).toBeString();
            expect(item.Name).toBeString();
            expect(item.ChannelType).toBeNumber();
            expect(item.ClientOrder).toBeNumber();
            expect(item.IsTop).toBeNumber();
            expect(item.IconUpdateAt).toBeDefined();
            expect(item.IconUrl).toBeDefined();
            expect(item.Categories).toBeArray();
            for (const cate of item.Categories) {
                expect(cate).toBeObject();
                expect(cate).toContainKeys([
                    'CategoryID',
                    'ChannelID',
                    'Name',
                    'ClientOrder',
                    'ClientCmd',
                ]);
            }
        }

        done();
    });
});

describe('testing /devices', () => {
    test('must has 2 devices & all [online]', async (done) => {
        const response = await request(app.callback()).post('/getnewslist').send({
            clientCmd: "GetAllNewsList"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeArray();
        expect(response.body).not.toBeArrayOfSize(0);
        for (const news of response.body) {
            expect(news).toContainKeys([
                'NewsID',
                'CategoryID',
                'CategoryName',
                'ChannelID',
                'ChannelName',
                'Url',
                'NewsTime',
                'Title',
                'Description',
                'NewsType',
                'ViewState',
            ]);
            expect(news.NewsID).toBeString();
            expect(news.CategoryID).toBeString();
            expect(news.CategoryName).toBeString();
            expect(news.ChannelID).toBeString();
            expect(news.ChannelName).toBeString();
            expect(news.Url).toBeString();
            expect(news.NewsTime).toBeString();
            expect(news.Title).toBeString();
            expect(news.Description).toBeString();
            expect(news.NewsID).toBeString();
            expect(news.NewsType).toBeNumber();
            expect(news.ViewState).toBeObject();
            expect(news.ViewState).toContainKeys([
                'Status',
                'ShowStr',
                'ShowColor',
            ]);
            expect(news.ViewState.Status).toBeNumber();
            expect(news.ViewState.Status).toBeWithin(1, 4);
            expect(news.ViewState.ShowStr).toBeString();
            expect(news.ViewState.ShowColor).toBeString();
        }
        done();
    });

    test(`after ${testExpiredSec} seconds, all devices need to be [offline]`, async (done) => {
        const response = await request(app.callback()).post('/getnewslist').send({
            clientCmd: "GetMtkNewsList::E1FBE42A-0DA8-4D3D-89C0-C80B49DC9CB0"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeArray();
        expect(response.body).not.toBeArrayOfSize(0);
        for (const news of response.body) {
            expect(news).toContainKeys([
                'NewsID',
                'CategoryID',
                'CategoryName',
                'ChannelID',
                'ChannelName',
                'Url',
                'NewsTime',
                'Title',
                'Description',
                'NewsType',
                'ViewState',
            ]);
            expect(news.NewsID).toBeString();
            expect(news.CategoryID).toBeString();
            expect(news.CategoryName).toBeString();
            expect(news.ChannelID).toBeString();
            expect(news.ChannelName).toBeString();
            expect(news.Url).toBeString();
            expect(news.NewsTime).toBeString();
            expect(news.Title).toBeString();
            expect(news.Description).toBeString();
            expect(news.NewsID).toBeString();
            expect(news.NewsType).toBeNumber();
            expect(news.ViewState).toBeObject();
            expect(news.ViewState).toContainKeys([
                'Status',
                'ShowStr',
                'ShowColor',
            ]);
            expect(news.ViewState.Status).toBeNumber();
            expect(news.ViewState.Status).toBeWithin(1, 4);
            expect(news.ViewState.ShowStr).toBeString();
            expect(news.ViewState.ShowColor).toBeString();
        }
        done();
    });
});

describe('testing: when clinets come back', () => {
    test('original stat [offline] to [online] after heartbeat', async (done) => {
        const response = await request(app.callback()).post('/getnewslist').send({
            clientCmd: "GetAllNewsList"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeArray();
        expect(response.body).not.toBeArrayOfSize(0);
        for (const news of response.body) {
            expect(news).toContainKeys([
                'NewsID',
                'CategoryID',
                'CategoryName',
                'ChannelID',
                'ChannelName',
                'Url',
                'NewsTime',
                'Title',
                'Description',
                'NewsType',
                'ViewState',
            ]);
            expect(news.NewsID).toBeString();
            expect(news.CategoryID).toBeString();
            expect(news.CategoryName).toBeString();
            expect(news.ChannelID).toBeString();
            expect(news.ChannelName).toBeString();
            expect(news.Url).toBeString();
            expect(news.NewsTime).toBeString();
            expect(news.Title).toBeString();
            expect(news.Description).toBeString();
            expect(news.NewsID).toBeString();
            expect(news.NewsType).toBeNumber();
            expect(news.ViewState).toBeObject();
            expect(news.ViewState).toContainKeys([
                'Status',
                'ShowStr',
                'ShowColor',
            ]);
            expect(news.ViewState.Status).toBeNumber();
            expect(news.ViewState.Status).toBeWithin(1, 4);
            expect(news.ViewState.ShowStr).toBeString();
            expect(news.ViewState.ShowColor).toBeString();
        }
        done();
    });
});


afterAll((done) => {
    console.log(`Test Completed`);
    model.Disconnect();
    done();
});