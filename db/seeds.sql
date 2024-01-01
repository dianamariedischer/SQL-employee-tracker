INSERT INTO department (name)
VALUES ("Coolest Ever"),
       ("Prep"),
       ("Kitchen"),
       ("Design"),
       ("Dirtbag");
       
INSERT INTO role (title, salary, department_id)
VALUES ("Soda Jerk", 18000, 1),
       ("Senior Soda Jerk", 23000, 1),
       ("Shift Lead", 28000, 1),
       ("Assistant Manager", 35000, 1),
       ("Floor Manager", 45000, 1),
       ("Manager", 60000, 1),
       ("Facilities Crew", 45000, 2),
       ("Facilities Manager", 60000, 2),
       ("Ice Cream Maker", 30000, 3),
       ("Kitchen Manager", 60000, 3),
       ("Design Assistant", 30000, 4),
       ("Design Director", 85000, 5),
       ("Owner", 250000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Eric", "Berley", 13, NULL),
       ("Ryan", "Berley", 13, NULL),
       ("Yasmeen", "Brown", 6, 1),
       ("Denny", "Martinez", 8, 1),
       ("Leslie", "McLaughlin", 10, 2),
       ("Pavia", "Burroughs", 2, 12),
       ("Daquan", "Strickland", 5, 3),
       ("Carlos", "Polonia", 3, 7),
       ("Mavis", "Rodriguez", 3, 7),
       ("Sue", "Pedraza", 3, 7),
       ("Cody", "Long", 3, 7),
       ("Miles", "Meola", 2, 7),
       ("Callie", "Simmerly", 9, 5),
       ("Jonathan", "Vargas", 7, 4),
       ("Chloe", "Howard", 6, 11);