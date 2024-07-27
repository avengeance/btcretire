import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import About from "./About";
import Donate from "./Donate";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-background border-t">
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="donate">Donate</TabsTrigger>
        </TabsList>
        <div className="max-h-100 overflow-y-auto">
          <TabsContent value="about">
            <About />
          </TabsContent>
          <TabsContent value="donate">
            <Donate />
          </TabsContent>
        </div>
      </Tabs>
    </footer>
  );
};

export default Footer;
