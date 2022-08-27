import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { NextPageContext } from 'next';
import Script from 'next/script';
import JSXStyle from 'styled-jsx/style';

interface valProps {
  name?: string
  score?: string | number
}

export default function Home() {
  const [WindowWidth, setWidth] = useState(0);
  const [WindowHeight, setHeight] = useState(0);
  const [topList, setList] = useState([]);
  let doLoad=0;
  useEffect(() => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight);
    async function loadData() {
      if(doLoad===1){return;}
      doLoad=1;
      const response = await fetch(`/api/people`);
      const list = await response.json();
      doLoad=0;
      setList(list);
    }
    setInterval(loadData,200);
  }, [])
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <title>SquareGame</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />

      <div id="instruct" style={{ zIndex: 50, backgroundColor: "white", position: "absolute", width: "100%", height: "80%" }} className="Flexcol center">
        <Image
          width={WindowWidth / 3}
          height={WindowHeight / 3}
          layout="fixed"
          alt="..."
          src="/Images/WASD picture.jpg"
        />
      </div>
      <div
        style={{
          paddingTop: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end"
        }}
      >
        <form
          id="Gname"
          style={{ zIndex: 75, fontSize: 20 }}
          onSubmit={(e) => { e.preventDefault(); }}
        >
          <label htmlFor="name">
            <strong>Name (Top 10 RECORDS)</strong>
          </label>
          <input id="name" required />
        </form>
      </div>
      <h1 className="center">Square game</h1>
      <div style={{ position: "absolute", paddingLeft: "44%" }}>
        <div style={{ fontSize: 20 }}>
          <span>
            <strong>Max score:</strong>
          </span>
          <span id="Mxscore">
            <strong>0</strong>
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", paddingLeft: "80%" }}>
        <div style={{ fontSize: 20 }}>
          <span>
            <strong>Current speed:</strong>
          </span>
          <span id="curSpeed">1</span>
        </div>
      </div>
      <br />
      <br />
      <div className="flexrow center" >
        <button
          id="ResetMax"
          style={{
            color: "white",
            backgroundColor: "red",
            borderRadius: "5px 5px"
          }}
        >
          Reset Max Score
        </button>
      </div>
      <br />
      <div
        id="MainR"
        style={{ opacity: 0 }}
        className="Flexrow center"
        tabIndex={-1}
      >
        <div
          id="Rmenu"
          style={{ position: "absolute", backgroundColor: "white" }}
          className="Flexcol center"
        >
          <button id="Restartbutton" style={{ height: 50, width: 100 }}>
            Restart
          </button>
        </div>
      </div>
      <div className="Flexrow center" tabIndex={-1}>
        <canvas
          id="mycanvas"
          style={{ borderStyle: "solid", backgroundColor: "lightgray" }}
        />
        <div className="Flexrow center" style={{position:"absolute",marginRight:"75%"}}>
          <table style={{borderSpacing:"0"}}>
            <tbody>
              <tr>
                <td style={{backgroundColor:"lightgrey",color:"black",borderStyle:"solid",borderBlockColor:"white",borderBottomColor:"black",borderTopColor:"black",borderWidth:"0.5px 0px 0.5px 0.5px"}}>Rank</td>
                <td style={{backgroundColor:"lightgrey",color:"black",borderStyle:"solid",borderBlockColor:"white",borderBottomColor:"black",borderTopColor:"black",borderWidth:"0.5px 0.5px"}}>Name</td>
                <td style={{backgroundColor:"lightgrey",color:"black",borderStyle:"solid",borderBlockColor:"white",borderBottomColor:"black",borderTopColor:"black",borderWidth:"0.5px 0.5px 0.5px 0px"}}>Score</td>
              </tr>
              {topList?.map((val: valProps, index) => {
                if(index>9){return null;}
                return (
                  <tr key={index}>
                    {(index===9 ? 
                    <><td style={{backgroundColor:"lightgrey",color:"black",borderStyle:"solid",borderBlockColor:"white",borderBottomColor:"black",borderWidth:"0.5px 0px 0.5px 0.5px"}}>{index + 1}</td>
                    <td style={{backgroundColor:"skyblue",color:"black",borderStyle:"solid",borderBlockColor:"white",borderBottomColor:"black",borderWidth:"0.5px 0.5px 0.5px 0.5px"}}>{val.name}</td>
                    <td style={{backgroundColor:"lightgreen",color:"black",borderStyle:"solid",borderBlockColor:"white",borderBottomColor:"black",borderWidth:"0.5px 0.5px 0.5px 0px"}}>{val.score}</td></>
                    :
                    <><td style={{backgroundColor:"lightgrey",color:"black",borderStyle:"solid",borderBlockColor:"white",borderWidth:"0.5px 0px 0.5px 0.5px"}}>{index + 1}</td>
                    <td style={{backgroundColor:"skyblue",color:"black",borderStyle:"solid",borderBlockColor:"white",borderWidth:"0.5px 0.5px 0.5px 0.5px"}}>{val.name}</td>
                    <td style={{backgroundColor:"lightgreen",color:"black",borderStyle:"solid",borderBlockColor:"white",borderWidth:"0.5px 0.5px 0.5px 0px"}}>{val.score}</td></>)}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{
          boxSizing: "border-box",
          marginLeft: "75%",
          position: "absolute",

        }}>
          <Image
            id="upSpeed"
            layout="fixed"
            src="/Images/+1 arrow.png" alt="..."

            width="100px"
            height="100px"
          />
        </div>
        <div style={{
          boxSizing: "border-box",
          marginLeft: "75%",
          marginTop: "13%",
          position: "absolute"
        }}>
          <Image
            id="downSpeed"
            layout="fixed"
            src="/Images/-1 arrow.png" alt="..."
            width="100px"
            height="100px"
          />
        </div>
      </div>
      <p className="center">
        Instructions: <strong>WASD</strong> to move, <strong>Space</strong> to
        pause, <strong>R</strong> to restart
      </p>
      <p className="center">
        <strong>UpArrow</strong> to +1 speed, <strong>DownArrow</strong> to -1 speed
      </p>
      <p className="center">(tap or click on the game square if problems!)</p>
      <Script src="script.js" ></Script>
    </>

  )
}


