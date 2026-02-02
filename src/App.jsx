import { useState,useEffect } from "react"
import { Footer } from "./components/Footer"
import { Guitar } from "./components/Guitar"
import { Header } from "./components/Header"
import { db } from "./data/db.js"

export function App() {

  function initialCart(){
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart? JSON.parse(localStorageCart):[]
  }

  const [data, setData] = useState(db)
  const [cart, setCart] = useState(initialCart());
  
  
  useEffect(()=> {
  localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

  function addToCart(guitar) {
    const itemIndex = cart.findIndex((item)=> guitar.id === item.id);
    console.log(itemIndex);
    if(itemIndex === -1){ // no existe el item en el carrito aun
      guitar.quantity = 1;
      console.log("Agregado al carrito la guitarra", guitar?.name)
      setCart([...cart, guitar])
    } else { // si la guitarra ya esta en el carro, 
      const updatedCart = [...cart] // creando una copia del carro
      updatedCart[itemIndex].quantity++; // subiendo la cantidad del item
      setCart(updatedCart); // actualizando el estado del carro
    }

  }

  function calculateTotal(){
    /*
    let total = 0;
    for (const guitar of cart){
      total += guitar.price * guitar.quantity;
      */
    let total = cart.reduce((total, item)=> total + item.price * item.quantity, 0);
    return total;
  }

  function addItem(guitar) {
    const itemIndex = cart.findIndex((item) => item.id === guitar.id);
    if (itemIndex === -1) return;
    const updatedCart = [...cart];
    updatedCart[itemIndex].quantity++;
    setCart(updatedCart);
  }

  function removeItem(guitar) {
    const itemIndex = cart.findIndex((item) => item.id === guitar.id);
    if (itemIndex === -1) return;
    const updatedCart = [...cart];
    updatedCart[itemIndex].quantity--;
    if (updatedCart[itemIndex].quantity <= 0) {
      setCart(updatedCart.filter((item) => item.id !== guitar.id));
    } else {
      setCart(updatedCart);
    }
  }

  function removeFromCart(guitar) {
    setCart(cart.filter((item) => item.id !== guitar.id));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <>
      <Header
        cart={cart}
        total={calculateTotal()}
        addItem={addItem}
        removeItem={removeItem}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar key={guitar.id} guitar={guitar} addToCart={addToCart} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
