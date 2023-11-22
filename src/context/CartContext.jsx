import { createContext, useState } from "react";
import Swal from 'sweetalert2'
export const CartContext = createContext();

export const CartProvider = ({children})=>{
    const [productCartList, setProductCartList] = useState([]);

    const isInCart = (id)=>{
        const elementExists = productCartList.some((elemento)=>elemento.id === id);
        return elementExists;
    }
    function saveCart () {
        localStorage.setItem("productsCartList", JSON.stringify(productCartList));
    
    }

    const addProduct = (product, qty)=>{
        const added =()=>{
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Agregado!',
                showConfirmButton: false,
                timer: 700,
                width: 250
              })

        }
        const newList = [...productCartList];
        //verifico si el producto existe en el arreglo
        // si existe, actualice la propiedad quantity de ese producto
        if(isInCart(product.id)){
            const productIndex = productCartList.findIndex(element=>element.id===product.id);
            newList[productIndex].quantity = newList[productIndex].quantity + qty;
            newList[productIndex].totalPrice = newList[productIndex].quantity * newList[productIndex].price;
            setProductCartList(newList)
            added ()
            saveCart()
        } else{
        //si no existe, agregue el producto al listado
            const newProduct={...product, quantity:qty, totalPrice: qty*product.price}
           
            const newList = [...productCartList];
            newList.push(newProduct);
            setProductCartList(newList);
            added ()
            saveCart()
        }
    }

    const removeProduct = (idProduct)=>{
        const deleted =()=>{
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Producto eliminado!',
                showConfirmButton: false,
                timer: 700,
                width: 250
              })

        }
        const copyArray = [...productCartList];
        const newArray = copyArray.filter(elm=>elm.id !== idProduct);
        setProductCartList(newArray);
        deleted ()
        saveCart()
    }

    const clearProductCartList=()=>{
        setProductCartList([])
        saveCart()
    }

    const getTotalProducts = ()=>{
        const totalProducts = productCartList.reduce((acc,item)=>acc + item.quantity,0);
        return totalProducts;
    }

    const getTotalCost = () => {

        const totalAmount = productCartList.reduce((acc, item) =>acc + item.quantity * item.price,0);
        return totalAmount;

    }

    return(
        <CartContext.Provider value={{productCartList,addProduct, removeProduct, clearProductCartList, isInCart, getTotalProducts, getTotalCost}}>
            {children}
        </CartContext.Provider>
    )
}