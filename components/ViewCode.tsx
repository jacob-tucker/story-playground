import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Code } from "./atoms/CodeBlock";
import { registerExistingNft } from "@/lib/code-snippets/registerExistingNft";
import { setupClient } from "@/lib/code-snippets/setupClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { attachTerms } from "@/lib/code-snippets/attachTerms";
import { mintLicense } from "@/lib/code-snippets/mintLicense";
import { registerNewNft } from "@/lib/code-snippets/registerNewNft";
import { mintNft } from "@/lib/code-snippets/mintNft";
import { setupClientForMint } from "@/lib/code-snippets/setupClientForMint";

const data: {
  [type: string]: {
    title: string;
    description: string;
    code: { filename: string; code: string }[];
  };
} = {
  "register-existing-nft": {
    title: "Register IP Asset",
    description: "Register an existing NFT in your wallet as an IP Asset.",
    code: [
      { filename: "index.ts", code: registerExistingNft },
      { filename: "config.ts", code: setupClient },
    ],
  },
  "register-new-nft": {
    title: "Register IP Asset",
    description:
      "Mint a new NFT to represent your IP and register it as an IP Asset.",
    code: [
      { filename: "index.ts", code: registerNewNft },
      { filename: "mint.ts", code: mintNft },
      { filename: "config.ts", code: setupClientForMint },
    ],
  },
  "attach-terms": {
    title: "Attach terms to IP Asset",
    description: "Attach existing pre-set terms to an IP Asset.",
    code: [
      { filename: "index.ts", code: attachTerms },
      { filename: "config.ts", code: setupClient },
    ],
  },
  "mint-license": {
    title: "Mint a License Token",
    description: "Mint a License Token from an existing IP Asset.",
    code: [
      { filename: "index.ts", code: mintLicense },
      { filename: "config.ts", code: setupClient },
    ],
  },
};

export function ViewCode({ type }: { type: string }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">View Code</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full mt-6">
          <DrawerHeader>
            <DrawerTitle>{data[type].title}</DrawerTitle>
            <DrawerDescription>{data[type].description}</DrawerDescription>
          </DrawerHeader>
          <div className="pl-4">
            <Tabs defaultValue={data[type].code[0].filename}>
              <TabsList>
                {data[type].code.map((file) => {
                  return (
                    <TabsTrigger value={file.filename}>
                      {file.filename}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {data[type].code.map((file) => {
                return (
                  <TabsContent value={file.filename}>
                    <Code code={file.code} />
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
          {/* <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
