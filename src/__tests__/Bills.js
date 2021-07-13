import { fireEvent, screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import '@testing-library/jest-dom/extend-expect'
import Bills  from "../containers/Bills.js"
import { ROUTES } from "../constants/routes"
import firebase from "../__mocks__/firebase"
import { localStorageMock } from "../__mocks__/localStorage.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
	
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })

	// test si les dates sont bien trier dans l'odre décroissant
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
	// test loading page
    test('Then loading page render', () => {
      const html = BillsUI({ bills: null, loading: true, error:null })
      document.body.innerHTML = html
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
	// test error page
    test('Then error page render', () => {
      const html = BillsUI({ bills: null, loading: null, error: 'test error message' })
      document.body.innerHTML = html
      expect(screen.getByText('Erreur')).toBeInTheDocument()
    })
	// test d'intégration GET
	test('fetches bills from mock API GET', async () => {
		const getSpy = jest.spyOn(firebase, 'get')
		const bills = await firebase.get()
		expect(getSpy).toHaveBeenCalledTimes(1)
		expect(bills.data.length).toBe(4)
	})
	test('fetches bills from an API and fails with 404 message error', async () => {
		firebase.get.mockImplementationOnce(() =>
			Promise.reject(new Error('Erreur 404'))
		)
		const html = BillsUI({ error: 'Erreur 404' })
		document.body.innerHTML = html;
		const message = await screen.getByText(/Erreur 404/)
		expect(message).toBeTruthy()
	})
	test('fetches messages from an API and fails with 500 message error', async () => {
		firebase.get.mockImplementationOnce(() =>
			Promise.reject(new Error('Erreur 500'))
		)
		const html = BillsUI({ error: 'Erreur 500' })
		document.body.innerHTML = html
		const message = await screen.getByText(/Erreur 500/)
		expect(message).toBeTruthy()
	})
  })
  // test click on new bill button
  describe('When I click on the Create a new bill button', () => {
		test('Then sent to the NewBill page', () => {
			const html = BillsUI({ data: [] })
			document.body.innerHTML = html
			//simulation route constants/routes.js
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname })
			}
			//création note de frais containers/Bills.js
			const bills = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })
			const button = document.querySelector("[data-testid=btn-new-bill]");
			//vérification de l'appel de la fonction création nouvelle note de frais
			const clickNewBill = jest.fn((e) => bills.handleClickNewBill(e))
			button.addEventListener('click', clickNewBill)
			fireEvent.click(button)
			expect(clickNewBill).toHaveBeenCalled()
		})
	})
	// test click on eye button
	describe('When I click on the Eye Icon button', () => {
		test('Then a modal should open',  () => {
			
			const html = BillsUI({ data: bills })
			document.body.innerHTML = html
			//simulation route constants/routes.js
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname })
			}
			//création note de frais containers/Bills.js
			const bill = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage, })
			//simulation création fenêtre modale
			const modale = screen.getByTestId('modaleFileEmployee')
			$.fn.modal = jest.fn()
			
			//vérification de l'appel de l'ouverture de la modale
			const button = screen.getAllByTestId('icon-eye')[0]
			const clickIconEye = jest.fn((e) => {
				e.preventDefault()
				bill.handleClickIconEye(button)
			})
			button.addEventListener('click', clickIconEye)
			fireEvent.click(button)
			expect(clickIconEye).toHaveBeenCalled()
			
		})
	})
})