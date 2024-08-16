"use client";
import React, { useState } from "react";

function page() {
  const [color, setColor] = useState("transparent");
  console.log(color);
  let bgColor = `bg-[${color}]`
  return (
    <div style={{background:color}} className={`h-screen w-full `}>
      <label htmlFor="colorid">select color </label>
      <div className=" rounded-full h-10 w-10">
        <input
          className=" outline-none border-none rounded-lg h-10 w-10"
          onChange={(e) => setColor(e.target.value)}
          type="color"
          name="color"
          id="colorid"
        />
      </div>
    </div>
  );
}

export default page;
