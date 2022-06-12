const supertest = require('supertest');
const request = supertest('http://localhost:3000');

describe('Express Route Test', function () {
	it('should return hello world', async () => {
		return request.get('/hello')
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Hello BENR2423');
			});
	})

	it('login successfully', async () => {
		return request
			.post('/login')
			.send({ username: 'Gan', password: "Password" })
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining({
						_id: expect.any(String),
						username: expect.any(String),
					})
				);
			});
	});

	it('login failed', async () => {
		return request
			.post('/login')
			.send({ username: 'Gan', password: "Password-fail" })
			.expect('Content-Type', /text/)
			.expect(401)
			.then(response => {
				expect(response.text).toEqual("Invalid username or password")
			});
	});

	it('register', async () => {
		return request
			.post('/register')
			.send({ username: 'Arif', password: "Password" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Register success!");
			});
	});

	it('register failed', async () => {
		return request
			.post('/register')
			.send({ username: 'Gan', password: "Password" })
			.expect('Content-Type', /text/)
			.expect(401).then(response => {
				expect(response.text).toEqual("User already exits!");
			});
	});

	it('update', async () => {
		return request
			.patch('/update')
			.send({ username: 'Gan', newusername: "Gan" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Update success!");
			});
	});

	it('update failed', async () => {
		return request
			.patch('/update')
			.send({ username: 'Gan-new', newusername: "Gan" })
			.expect('Content-Type', /text/)
			.expect(401).then(response => {
				expect(response.text).toEqual("Invalid username");
			});
	})

	it('delete', async () => {
		return request
			.delete('/delete')
			.send({ username: 'Arif'})
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Delete success!");
			});
	});

});