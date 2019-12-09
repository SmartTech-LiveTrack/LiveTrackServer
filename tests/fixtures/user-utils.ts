import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

const apiPrefix = "/api/v1/";

export const addUser = (app, user: any, callback: Function) => {
    chai.request(app)
        .post(apiPrefix+"users/")
        .send(user)
        .end((err, res) => callback(err, res));
}