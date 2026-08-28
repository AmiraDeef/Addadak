import notfound from "../assets/Notfound.png"

const NotFound = () => {
    return (
        <div className="flex justify-center items-center mt-10 sm:mt-16 md:mt-20 px-4 w-full">
            <img
                src={notfound}
                alt="404 Not Found"
                className="w-full max-w-[650px] h-auto object-contain"
            />
        </div>
    )
}
export default NotFound;