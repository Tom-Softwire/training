-- Delete and recreate the Employment database

IF EXISTS ( SELECT * FROM master..sysdatabases WHERE name = 'Employment' ) BEGIN
  USE master
  DROP DATABASE Employment
END
GO

CREATE DATABASE Employment
GO

USE Employment
GO

-- Create the tables

CREATE TABLE Employees (
	Id int IDENTITY NOT NULL PRIMARY KEY,
	FirstName nvarchar(max) NOT NULL,
	LastName nvarchar(max) NOT NULL,
	Age int NOT NULL,
	Salary int NOT NULL,
	JobPositionId int NOT NULL,
	PensionFundId int NOT NULL
)
GO

CREATE TABLE JobPositions (
	Id int IDENTITY NOT NULL PRIMARY KEY,
	Title nvarchar(max) NOT NULL
)
GO

ALTER TABLE Employees
	ADD CONSTRAINT FK_Employees_JobPosition FOREIGN KEY (JobPositionId) REFERENCES JobPositions(Id)
GO

CREATE TABLE PensionFunds (
	Id int IDENTITY NOT NULL PRIMARY KEY,
	AmountContributed int NOT NULL,
	PensionProviderId int NOT NULL
)
GO

ALTER TABLE Employees
	ADD CONSTRAINT FK_Employees_PensionFund FOREIGN KEY (PensionFundId) REFERENCES PensionFunds(Id)
GO

CREATE TABLE PensionProviders (
	Id int IDENTITY NOT NULL PRIMARY KEY,
	Name nvarchar(max) NOT NULL
)
GO

ALTER TABLE PensionFunds
	ADD CONSTRAINT FK_PensionFunds_PensionProvider FOREIGN KEY (PensionProviderId) REFERENCES PensionProviders(Id)
GO

SET IDENTITY_INSERT PensionProviders ON
INSERT INTO PensionProviders (Id, Name) VALUES (1, 'ABC Pensions Ltd')
SET IDENTITY_INSERT PensionProviders OFF
SET IDENTITY_INSERT PensionFunds ON
INSERT INTO PensionFunds (Id, AmountContributed, PensionProviderId) VALUES (1, 0, 1)
SET IDENTITY_INSERT PensionFunds OFF
SET IDENTITY_INSERT JobPositions ON
INSERT INTO JobPositions (Id, Title) VALUES (1, 'Developer')
SET IDENTITY_INSERT JobPositions OFF
SET IDENTITY_INSERT Employees ON
INSERT INTO Employees (Id, FirstName, LastName, Age, Salary, JobPositionId, PensionFundId) VALUES (1, 'Kianna', 'Beltran', 27, 20000, 1, 1)
SET IDENTITY_INSERT Employees OFF
