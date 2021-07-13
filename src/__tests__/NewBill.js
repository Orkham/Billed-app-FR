import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import { ROUTES } from "../constants/routes"
import { bills } from "../fixtures/bills.js"

describe("Given I am connected as an employee", () => {
	describe("When I am on NewBill Page", () => {
		// test handleChangeFile
		test("Then handleChangeFile method works", () => {
			const html = NewBillUI()
			document.body.innerHTML = html
			//implémentation localStorage user
			Object.defineProperty(window, 'localStorage', { value: localStorageMock})
			window.localStorage.setItem('user', JSON.stringify({
				type: 'Employee',
				email: 'johndoe@email.com'
			}))
			//simulation routes
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname })
			}
			//création note de frais
			const obj = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })
			//simulation fonction handleChangeFile
			const handleChangeFile = jest.fn(obj.handleChangeFile)
			const file = "test.png"
			const input_file = screen.getByTestId("file")
			input_file.addEventListener("input", handleChangeFile)
			fireEvent.input(input_file, file)
			expect(handleChangeFile).toHaveBeenCalled()
		})
		// test handleSubmit
		test("Then handleSubmit method works", () => {
			const html = NewBillUI()
			document.body.innerHTML = html
			//implémentation localStorage user
			Object.defineProperty(window, 'localStorage', { value: localStorageMock})
			window.localStorage.setItem('user', JSON.stringify({
				type: 'Employee',
				email: 'johndoe@email.com'
			}))
			//simulation routes
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname })
			}
			//création note de frais
			const obj = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })
			//simulation fonction handleChangeFile
			const handleSubmit = jest.fn(obj.handleSubmit)
			const submitNewBill = screen.getByTestId('form-new-bill')
			submitNewBill.addEventListener("submit", handleSubmit)
			fireEvent.submit(submitNewBill)
			expect(handleSubmit).toHaveBeenCalled()
		})

    // test d'intégration POST
		describe("Given I am a user connected as an Employee", () => {
			describe("When I submit a new bill", () => {
				test("bill is posted in mock API", async () => {
					const testBill = {
						"email": "michel@paul.czh",
						"type": "Restaurants et bars",
						"name": "test post",
						"amount": 200,
						"date": "2020-02-02",
						"vat": "40",
						"pct": 20,
						"commentary": "test-moi",
						"value": "",
						"fileUrl": "https://test.com/jesuisuntestpost",				
						"fileName": "je_suis_un_test.jpg",
						"status": "pending"						
					}

					//const postSpy = jest.spyOn(firebase, "post")
					const postBill = await firebase.post(testBill)
					//expect(postSpy).toHaveBeenCalledTimes(1)
					expect(postBill).toBe("Bill test post received.")
				})
			})
		})
		
	})
})