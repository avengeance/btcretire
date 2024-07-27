import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import About from "./About";
import Donate from "./Donate";
import Disclaimer from "./Disclaimer";
import Privacy from "./Privacy";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-background">
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="donate">Donate</TabsTrigger>
          <TabsTrigger value="disclaimer">Disclaimer</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        <div className="max-h-100 overflow-y-auto">
          <TabsContent value="about">
            <About />
          </TabsContent>
          <TabsContent value="donate">
            <Donate />
          </TabsContent>
          <TabsContent value="disclaimer">
            <Disclaimer />
          </TabsContent>
          <TabsContent value="privacy">
            <Privacy />
          </TabsContent>
        </div>
      </Tabs>
    </footer>
  );
};

export default Footer;
