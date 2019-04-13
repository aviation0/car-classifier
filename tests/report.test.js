const request = require("supertest")
const app = require("../app");
const Report = require("../models/report");
const Vehicle = require("../models/vehicle");
//path for test file
const filePath = `${__dirname}/../testFiles/test.xml`;

beforeEach( async () => {
    await Report.deleteMany();
    await Vehicle.deleteMany();
    //const response = await request(app).post("/new").attach('file', filePath);
});

// tests on POST
test("should create new report", async () => {
    const response = await request(app).post("/new").attach('file', filePath).expect(200);
    
});

test("should find in database", async () => {
    const response = await request(app).post("/new").attach('file', filePath).expect(200);
    const responseObject = JSON.parse(response.text);
    //searching response report in database
    const report = await Report.findById(responseObject._id);
    expect(report).not.toBeNull();
});

test("should match 'types' property", async () => {
    const response = await request(app).post("/new").attach('file', filePath).expect(200);
    const responseObject = JSON.parse(response.text);

    expect(responseObject.types).toMatchObject({
        "BigWheel" : 2,
        "Bicycle" : 0,
        "Motorcycle" : 0,
        "HangGlider" : 0,
        "Car" : 0 
    });
});

test("should identify vehicles corrrectly", async () => {
    const response = await request(app).post("/new").attach('file', filePath).expect(200);
    const responseObject = JSON.parse(response.text);

    expect((responseObject.vehicles).length).toBe(2);
    expect(responseObject.vehicles[0].type).toBe("Big Wheel");
    expect(responseObject.vehicles[1].type).not.toBe("Car");
});

//tests on GET - "/:id"
test("should find a report after creating it", async () => {
    const response = await request(app).post("/new").attach('file', filePath).expect(200);
    const responseObject = JSON.parse(response.text);

    const singleReport = await request(app).get(`/${responseObject._id}`).expect(200);
    const singleReportObject = JSON.parse(singleReport.text);

    expect(singleReportObject).not.toBeNull();

});