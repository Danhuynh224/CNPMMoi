import { useState } from "react";
import { CartProvider, useCart, Button, Input } from "./index";

const CartDemo = () => {
  const { items, addItem, removeItem } = useCart();
  const [item, setItem] = useState("");

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Cart Demo</h2>
      <div className="flex gap-2">
        <Input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="Enter product"
        />
        <Button
          onClick={() => {
            if (!item) return;
            addItem({
              id: Date.now().toString(),
              name: item,
              price: 100,
              quantity: 1,
            });
            setItem("");
          }}
        >
          Add
        </Button>
      </div>

      <ul className="mt-4">
        {items.map((c) => (
          <li key={c.id} className="flex justify-between">
            <span>
              {c.name} x {c.quantity}
            </span>
            <Button variant="secondary" onClick={() => removeItem(c.id)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <CartDemo />
    </CartProvider>
  );
}

export default App;
