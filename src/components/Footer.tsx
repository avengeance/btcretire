import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import About from "./About";
import Donate from "./Donate";

const Footer: React.FC = () => {
  return (
    <footer className="mt-8">
      <Tabs defaultValue="about">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="donate">Donate</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <About />
        </TabsContent>
        <TabsContent value="donate">
          <Donate />
        </TabsContent>
      </Tabs>
    </footer>
  );
};

export default Footer;
