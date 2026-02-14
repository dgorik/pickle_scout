"use client";

import { useEffect, useState } from "react";

type Favs = {
  shape: string;
  color: string;
  animal: string;
};

type User = {
  id: string;
  name: string;
  favorites: Favs;
};

export default function Test() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setErrors] = useState("");

  const url = "https://example.gcommer.com/users";
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        setErrors("Error");
      }
    };
    fetchUsers();
  }, []);

  if (error) return <p> {error} </p>;

  return (
    <div>
      <p> Hello there</p>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} = {user.favorites.shape}
        </li>
      ))}
    </div>
  );
}

///make a flashcaro on why you need to name components with a capital letter and why you need use default
