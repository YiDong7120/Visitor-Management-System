const supertest = require('supertest');
const request = supertest('http://localhost:3000');

describe('Express Route Test', function () {
	it('should return Hello from BENR2423', async () => {
		return request.get('/hello')
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Hello from BENR2423');
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
	})

	it('delete visitor', async () => {
		return request
			.delete('/deleteVisitor')
			.send({ visitor_id: "f4f5a27c-7d3d-40b5-b508-35debc009d84" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Delete success!");
			});
	});

	it('delete reservation', async () => {
		return request
			.delete('/deleteReservation')
			.send({ reserve_id: "25112e65-64d1-4a0c-9f87-6951d1bf4ea4" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Delete success!");
			});
	});

/////////////////////////////////////////////
	it('login successfully', async () => {
		return request
			.post('/login')
			.send({ username: 'Idzwan', password: "Password" })
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
			.send({ username: 'Idzwan', password: "Password-fail" })
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
			.send({ username: 'Idzwan', password: "Password" })
			.expect('Content-Type', /text/)
			.expect(401).then(response => {
				expect(response.text).toEqual("User already exits!");
			});
	});

	it('update', async () => {
		return request
			.patch('/update')
			.send({ username: 'Idzwan', newusername: "Idzwan" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Update success!");
			});
	});

	it('update failed', async () => {
		return request
			.patch('/update')
			.send({ username: 'Idzwan-new', newusername: "Idzwan" })
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
	})

	it('find visitor', async () => {
		return request
			.get('/visitor/7ac1937b-73aa-45d9-b89f-7ae962e1302f')
			.expect(200)
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

	it('find reservation', async () => {
		return request
			.get('/reservation/0b8ded40-3495-4d02-8177-1265cc002f61')
			.expect(200)
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
});