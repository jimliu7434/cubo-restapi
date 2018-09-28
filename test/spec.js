const { app, model, conf } = require('../app');
const request = require('supertest');
const UUID4 = require('uuid/v4');
const legalID1 = UUID4();
const legalID2 = UUID4();
const legalID3 = UUID4();
const illegalID1 = 'test-device1';
const illegalID2 = '!#$#@^$%^&^(*&^*(&^*(^%&$#%^^&#';

const {
    expiredSec,
    checkMin,
} = conf;

const testExpiredSec = expiredSec + (checkMin * 60);

jest.setTimeout(testExpiredSec * 1000 + 1000);

describe('testing /heartbeat', () => {
    test('Using a legal deviceid (UUID) 1', async (done) => {
        const response = await request(app.callback()).post(`/heartbeat/${legalID1}`).send();
        expect(response.statusCode).toBe(200);
        done();
    });

    test('Using a legal deviceid (UUID) 2', async (done) => {
        const response = await request(app.callback()).post(`/heartbeat/${legalID2}`).send();
        expect(response.statusCode).toBe(200);
        done();
    });

    test('Using an illegal deviceid (not UUID)', async (done) => {
        const response = await request(app.callback()).post(`/heartbeat/${illegalID1}`).send();
        expect(response.statusCode).toBe(400);
        done();
    });

    test('Using an illegal deviceid (special chars)', async (done) => {
        const response = await request(app.callback()).post(`/heartbeat/${illegalID2}`).send();
        expect(response.statusCode).toBe(400);
        done();
    });
});

describe('testing /device', () => {
    test('Using an Existed legal deviceid', async (done) => {
        const response = await request(app.callback()).get(`/device/${legalID1}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeObject();
        expect(response.body).toContainKeys([
            'deviceid',
            'heartbeat',
            'isonline',
        ]);
        expect(response.body.deviceid).toBe(legalID1);
        expect(response.body.heartbeat).not.toBe(0);
        expect(response.body.isonline).toBe(1);

        done();
    });

    test('Using a NOT Existed legal deviceid', async (done) => {
        const response = await request(app.callback()).get(`/device/${legalID3}`).send();
        expect(response.statusCode).toBe(204);
        done();
    });

    test('Using an illegal deviceid (not UUID)', async (done) => {
        const response = await request(app.callback()).get(`/device/${illegalID1}`).send();
        expect(response.statusCode).toBe(400);
        done();
    });

    test('Using an illegal deviceid (special chars)', async (done) => {
        const response = await request(app.callback()).get(`/device/${illegalID2}`).send();
        expect(response.statusCode).toBe(400);
        done();
    });
});

describe('testing /devices', () => {
    test('at least 2 devices & legalID1/2 are [online]', async (done) => {
        const response = await request(app.callback()).get('/devices').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeArrayOfSize(0);
        for (const device of response.body) {
            expect(device).toContainKeys([
                'deviceid',
                'heartbeat',
                'isonline',
            ]);
            expect(device.deviceid).toBeString();
            expect(device.heartbeat).not.toBe(0);
            if (device.deviceid === legalID1 || device.deviceid === legalID2)
                expect(device.isonline).toBe(1);
        }
        done();
    });

    test(`after ${testExpiredSec} seconds, legalID1/2 need to be [offline]`, async (done) => {
        setTimeout(async () => {
            const response = await request(app.callback()).get('/devices').send();
            expect(response.statusCode).toBe(200);
            expect(response.body).not.toBeArrayOfSize(0);
            for (const device of response.body) {
                expect(device).toContainKeys([
                    'deviceid',
                    'heartbeat',
                    'isonline',
                ]);
                expect(device.deviceid).toBeString();
                expect(device.heartbeat).not.toBe(0);
                if (device.deviceid === legalID1 || device.deviceid === legalID2)
                    expect(device.isonline).toBe(0);
            }
            done();
        }, testExpiredSec * 1000);
    });
});

describe('testing: when clients come back', () => {
    test('original stat [offline] to [online] after heartbeat', async (done) => {
        const step1_resp = await request(app.callback()).post(`/heartbeat/${legalID1}`).send();
        expect(step1_resp.statusCode).toBe(200);
        const step2_resp = await request(app.callback()).get(`/device/${legalID1}`).send();
        expect(step2_resp.statusCode).toBe(200);
        expect(step2_resp.body).toBeObject();
        expect(step2_resp.body).toContainKeys([
            'deviceid',
            'heartbeat',
            'isonline',
        ]);
        expect(step2_resp.body.deviceid).toBe(legalID1);
        expect(step2_resp.body.heartbeat).not.toBe(0);
        expect(step2_resp.body.isonline).toBe(1);
        done();
    });
});


afterAll((done) => {
    console.log(`Test Completed`);
    model.Disconnect();
    done();
});