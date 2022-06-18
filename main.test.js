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

	it('user login successfully', async () => {
		return request
			.post('/user/login')
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

	it('user login failed', async () => {
		return request
			.post('/user/login')
			.send({ username: 'Gan', password: "Password-fail" })
			.expect('Content-Type', /text/)
			.expect(401)
			.then(response => {
				expect(response.text).toEqual("Invalid username or password")
			});
	});

	it('user register successfully', async () => {
		return request
			.post('/user/register')
			.send({ username: 'Arif', password: "Password" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Register success!");
			});
	});

	it('user register failed', async () => {
		return request
			.post('/user/register')
			.send({ username: 'Gan', password: "Password" })
			.expect('Content-Type', /text/)
			.expect(401).then(response => {
				expect(response.text).toEqual("User already exits!");
			});
	});

	it('user update', async () => {
		return request
			.patch('/user/update')
			.send({ username: 'Gan', newusername: "Gan" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Update success!");
			});
	});

	it('update failed', async () => {
		return request
			.patch('/user/update')
			.send({ username: 'Gan-new', newusername: "Gan" })
			.expect('Content-Type', /text/)
			.expect(401).then(response => {
				expect(response.text).toEqual("Invalid username");
			});
	})

	it('delete user', async () => {
		return request
			.delete('/user/delete')
			.send({ username: 'Arif'})
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Delete success!");
			});
	})

	it('delete visitor', async () => {
		return request
			.delete('/user/deleteVisitor')
			.send({ visitor_id: "f4f5a27c-7d3d-40b5-b508-35debc009d84" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Delete success!");
			});
	});

	it('delete reservation', async () => {
		return request
			.delete('/user/deleteReservation')
			.send({ reserve_id: "25112e65-64d1-4a0c-9f87-6951d1bf4ea4" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Delete success!");
			});
	});

	it('security login successfully', async () => {
		return request
			.post('/security/login')
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

	it('security login failed', async () => {
		return request
			.post('/security/login')
			.send({ username: 'Idzwan', password: "Password-fail" })
			.expect('Content-Type', /text/)
			.expect(401)
			.then(response => {
				expect(response.text).toEqual("Invalid username or password")
			});
	});

	it('security register successfully', async () => {
		return request
			.post('/security/register')
			.send({ username: 'Arif', password: "Password" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Register success!");
			});
	});

	it('security register failed', async () => {
		return request
			.post('/security/register')
			.send({ username: 'Idzwan', password: "Password" })
			.expect('Content-Type', /text/)
			.expect(401).then(response => {
				expect(response.text).toEqual("User already exits!");
			});
	});

	it('security update', async () => {
		return request
			.patch('/security/update')
			.send({ username: 'Idzwan', newusername: "Idzwan" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Update success!");
			});
	});

	it('security update failed', async () => {
		return request
			.patch('/security/update')
			.send({ username: 'Idzwan-new', newusername: "Idzwan" })
			.expect('Content-Type', /text/)
			.expect(401).then(response => {
				expect(response.text).toEqual("Invalid username");
			});
	})

	it('security delete', async () => {
		return request
			.delete('/security/delete')
			.send({ username: 'Arif'})
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Delete success!");
			});
	})

	it('find visitor', async () => {
		return request
			.get('/visitor/6288c1ddf09cf4a2f1656f60')
			.expect(200)
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toStrictEqual({
						_id: expect.any(String),
						visitor_id: expect.any(String),
            			visitor_name: expect.any(String),
						visitor_age: expect.any(Number),
            			visitor_address: expect.any(String),
            			visitor_city: expect.any(String),
            			visitor_email: expect.any(String),
            			visitor_phone: expect.any(String),
            			visitor_ic: expect.any(String),
            			visitor_date: expect.any(String),
            			reserve_id: expect.any(String)
					})
			});
	});

	it('find reservation', async () => {
		return request
			.get('/reservation/6288c1ddf09cf4a2f1656f61')
			.expect(200)
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toStrictEqual({
						_id: expect.any(String),
						reserve_id: expect.any(String),
            			reserve_vehicle: expect.any(String),
            			reserve_date: expect.any(String),
            			reserve_plate: expect.any(String),
            			visitor_id: expect.any(String)
					})
			});
	});

	it('find user', async () => {
		return request
			.get('/user/62a5a93d6ad10471d24b013b')
			.expect(200)
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toStrictEqual({
						_id: expect.any(String),
						role: expect.any(String),
						username: expect.any(String),
						password: expect.any(String),
					})
			});
	});
});