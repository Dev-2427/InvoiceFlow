import { useNavigate } from "react-router-dom"

export default function CreateOptionsMenu() {

    const navigate = useNavigate()

    return (
        <div className="absolute top-full right-0 mt-1 bg-card w-38 rounded-lg overflow-hidden shadow-xl border border-border">
            <button
                onClick={() => navigate("/invoices/new")}
                className="text-text text-sm font-semibold px-5 py-2 cursor-pointer w-full hover:bg-navy-50">New Invoice</button>
            <hr className="border opacity-35 border-border" />
            <button
                onClick={() => navigate("/clients/new")}
                className="text-text text-sm font-semibold px-5 py-2 cursor-pointer w-full hover:bg-navy-50">New Client</button>
        </div>
    )
}
