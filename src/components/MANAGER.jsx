
import { useState, useEffect } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';


const manager = () => {
    const [Form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setpasswordArray] = useState([]);


    useEffect(() => {
        // This function runs when the component mounts
        let storedPasswords = localStorage.getItem('passwords');
        // Gets data from localStorage using the key 'passwords'
        // Returns a string or null if nothing is found


        if (storedPasswords) {
            // Only runs if storedPasswords is not null/undefined
            setpasswordArray(JSON.parse(storedPasswords));
            // Converts the JSON string back to a JavaScript array/object
            // and updates the passwordArray state
        }
        else {

        }
    }, []); // Empty dependency array means this only runs once when component mounts



    const deletpass = (id) => {
        const c = window.confirm("Are you sure you want to delete this password? This action cannot be undone.");
        if (!c) {
            toast('❌ Deletion cancelled', {
                position: "top-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }
        else {
            const updatedArray = passwordArray.filter(item => item.id !== id);
            setpasswordArray(updatedArray);
            localStorage.setItem('passwords', JSON.stringify(updatedArray));
            toast('🗑️ Password deleted', {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
       
    }
    // If user confirms deletion
    // Filter out the item with the given id from passwordArray
    // and update the state
    // This will remove the item from the array


};

const editpass = (id) => {
    const itemToEdit = passwordArray.find(item => item.id === id);
    if (itemToEdit) {
        setForm({
            site: itemToEdit.site,
            username: itemToEdit.username,
            password: itemToEdit.password
        });
        // Remove the item being edited from the array
        const updatedArray = passwordArray.filter(item => item.id !== id);
        setpasswordArray(updatedArray);
        localStorage.setItem('passwords', JSON.stringify(updatedArray));
       
    }
};

const savepas = () => {
    if (Form.site === "" || Form.username === "" || Form.password === "") {
        toast('🤬Please add password', {
            position: "top-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
        return;
    }
    const newArray = [...passwordArray, { ...Form, id: uuidv4() }];
    setpasswordArray(newArray);
    localStorage.setItem('passwords', JSON.stringify(newArray));
    // Saves the updated passwordArray to localStorage

    // const depass = [...passwordArray, {...Form, id: uuidv4() }];
    // setpasswordArray(newArray);
    // localStorage.setItem('passwords', JSON.stringify(newArray));

    console.log(newArray);//displaying the new array in console
    setForm({ site: "", username: "", password: "" });
    // Resets the Form state to empty strings
    toast('✅ PASSWORD ADDED', {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
    // Displays a success message
}
const handlechange = (e) => {
    setForm({ ...Form, [e.target.name]: e.target.value });
    console.log(Form);
}








// Function to copy text to clipboard
function copytxt(text) {
    navigator.clipboard.writeText(text);
    toast('✅ copied to clipbord', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });
}

return (
    <>
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
        />
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>

        {/* backgorund */}
        <div className="mx-auto max-w-4xl ">
            {/* the logo fonts from here */}
            <h1 className="text-5xl font-extrabold text-center mb-4 tracking-tight">
                <span className="text-indigo-700">&lt;</span>
                <span>Pa</span>
                <span className="text-green-600">S</span>
                <span className="text-green-500">S</span>
                <span className="text-black">/</span>
                <span className="text-indigo-800">-</span>
                <span className="text-pink-800">-</span>
                <span className="text-indigo-600">MaN&gt;</span>
            </h1>

            <p className="text-lg text-center text-gray-700 mb-8">
                Your own Password Manager</p>

            {/* the logo fonts till here */}

            {/* Input Section - Enhanced */}
            <div className="flex flex-col p-6 gap-4 items-center">

                <label className="text-lg font-semibold text-black mb-1" htmlFor="site">
                    Website-/-App
                </label>

                <input value={Form.site} onChange={handlechange}
                    className="rounded-xl border-2 border-green-400 focus:border-pink-600 focus:ring-2 focus:ring-pink-200 w-full px-4 py-2 text-lg transition-all duration-200 outline-none"
                    type="text"
                    name="site"
                    id="site"
                    placeholder="e.g:- github.com"
                    autoComplete="off"
                />

                <div className="flex gap-4">

                    <div className="flex-1 flex flex-col">
                        <label className="text-md font-medium text-black-700 mb-1" htmlFor="username">
                            Username-/-Email
                        </label>
                        <input value={Form.username} onChange={handlechange}
                            className="rounded-xl border-2  border-green-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 w-full px-4 py-2 text-md transition-all duration-200 outline-none"
                            type="text"
                            name="username"
                            id="username"
                            placeholder="your@email.com"
                            autoComplete="off"
                        />

                    </div>

                    <div className="flex-1 flex flex-col">
                        <label className="text-md font-medium text-black-700 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input value={Form.password} onChange={handlechange}
                            className="rounded-xl border-2 border-green-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 w-full px-4 py-2 text-md transition-all duration-200 outline-none"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            autoComplete="off"
                        />
                    </div>

                </div>
                {/* btn-part */}
                <button onClick={savepas} className='flex justify-center items-center text-gray-900 font-bold bg-green-500 rounded-2xl w-1/4 px-1 py-2 border border-green-800 hover:bg-green-400 text-xl'>
                    <lord-icon src="https://cdn.lordicon.com/efxgwrkc.json" trigger="hover">
                    </lord-icon>
                    Save
                </button>
                {/* btn-part */}
            </div>
            {/* End Input Section */}

            {/* the password tables */}
            {passwordArray.length === 0 && <div className='text-2xl font-bold'> No passwords to show, add some passwords</div>}
            {passwordArray.length !== 0 &&
                <div className="password">
                    <h2 className='font-bold text-2xl py-3'>Your Passwords</h2>
                    <table className="table-auto w-full overflow-hidden rounded-lg shadow-lg mb-10">
                        <thead className='bg-green-500 rounded-lg shadow-md text-gray-900'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username/Email</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passwordArray.map((item, idx) => (
                                <tr key={idx}>
                                    <td className='py-1 w-100 text-center'>
                                        <div className='flex items-center gap-2 justify-center'>
                                            <p className='text-xs'>Click-ToGo:</p>
                                            <a href={item.site} target='_blank' rel="noopener noreferrer" className='font-bold text-sm'>{item.site}</a>
                                            <div className="cursor-pointer" onClick={() => copytxt(item.site)}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", paddingTop: "4px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                ></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-1 w-100 text-center'>
                                        <div className='flex items-center gap-2 justify-center'>
                                            <span>{item.username}</span>
                                            <div className="cursor-pointer" onClick={() => copytxt(item.username)}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", paddingTop: "4px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                ></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-1 w-40 text-center'>
                                        <div className='flex items-center gap-2 justify-center'>
                                            <span>{item.password}</span>
                                            <div className="cursor-pointer" onClick={() => copytxt(item.password)}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", paddingTop: "4px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                ></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-1 w-40 text-center'>
                                        <div className='flex items-center gap-2 justify-center'>
                                            <span className='cursor-pointer mx-2'
                                                onClick={() => { editpass(item.id); }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>

                                            <span className='cursor-pointer mx-2' onClick={() => { deletpass(item.id); }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/skkahier.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }



















        </div>





    </>
)
}

export default manager