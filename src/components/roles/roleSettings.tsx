"use client";
import React, { useState } from "react";
import InsertRole from "./insertRole";

const RoleSettings: React.FC = () => {
  const [, setRoles] = useState<any[]>([]);

  return (
    <div className="w-full">
      <InsertRole setRoles={setRoles} />
    </div>
  );
};

export default RoleSettings;
