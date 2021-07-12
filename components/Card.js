import React from "react"

const Card = ({ title, description, children }) => {
  return (
    <div className=" flex flex-col justify-between  shadow-sh transform transition duration-300 cursor-pointer rounded-xl hover:shadow-lg hover:-translate-y-2 ">
      {children}      
      <div className=" flex flex-col space-y-4 py-4 px-6">
        <h1 className="font-semibold ml-2 text-2xl font-inter">{title}</h1>
      </div>
      <div className="flex justify-around p-4 bg-black text-white rounded-b-xl">
        <div>
          <p className="text-lg text-gray-300 font-quick font-bold">Highest Bid</p>
          <span className="text-lg font-quick font-bold">0.55 ETH</span>
        </div>
        <div>
          <p className="text-lg text-gray-300 font-quick font-bold">List Price</p>
          <span className="text-lg font-quick font-bold">0.15 ETH</span>
        </div>
      </div>
    </div>
  )
}

export default Card
