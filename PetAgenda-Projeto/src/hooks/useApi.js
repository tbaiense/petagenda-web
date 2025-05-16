const url = import.meta.env.VITE_API_URL;

// API não esta em funcionamento ainda
export function useAddUser() {
  const addUser = async (user) => {
    try{
        const req = await fetch(`${url}/usuario`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        body: JSON.stringify(user),
        });
        const res = await req.json();
        alert("usuario inserido:", res);
        return res;
    }catch(errors){
        console.log("Erro ao cadastrar usuario:",errors)
    }
  };
  return { addUser };
}