import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function DemoLoader() {
  return (
    <BrowserOnly fallback={<div>Loading demo...</div>}>
      {() => {
        const UCFRDemo = require("../UCFRDemo").default;
        return <UCFRDemo />;
      }}
    </BrowserOnly>
  );
}
