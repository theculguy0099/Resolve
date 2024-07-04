# Project Setup and Testing Guide

This guide outlines the necessary steps to set up and run the project successfully.

## Running the Project

1. **Navigate to the Frontend Directory**:
   - Locate the frontend directory within the code folder.

2. **Install Dependencies**:
   - Run the command `npm i` to install all the necessary dependencies.

3. **Start the Application**:
   - Execute `npm start` to initiate the project.

> **Note**: After authentication, upon the user's initial entry into the employee dashboard, it's advisable to refresh the page once to ensure proper role assignment. Subsequent visits will dynamically adjust the dashboard according to the assigned role.

## Functionalities Overview

### Employee Functionalities:

1. **Raise Complaints**:
   - Submit complaints regarding any issues encountered.

2. **Check Complaint Status**:
   - Monitor the current status of submitted complaints.

3. **Communicate with Mediator**:
   - Send messages to the mediator regarding specific complaints identified by their complaint ID.

### Mediator Functionalities:

1. **Manage Complaints**:
   - Update the status of complaints as necessary.

2. **Communicate with Victims**:
   - Engage in communication with victims in a similar manner as with employees.

3. **Raise Complaints**:
   - Initiate new complaints as required.

4. **Check Complaint Status**:
   - Monitor the status of complaints.

### Admin Functionalities:

1. **Assign Mediators**:
   - Assign mediators to specific complaints for resolution.

2. **Manage User Roles**:
   - Modify user roles as needed.

## Additional Features

1. **Real-Time Notifications**:
   - Receive notifications for new complaint submissions, status changes, and mediator assignments.

2. **Sentiment Analysis**:
   - Classify complaint sentiment into categories: "low", "medium", "high", and "very high".

3. **Suggested Solutions**:
   - Utilize the Gemini API to generate suggested solutions for complaints before resolution.

4. **Top 5 Recent Complaints**:
   - View a dynamic table displaying the top 5 recently raised complaints on each dashboard's homepage.

5. **User Logout Option**:
   - Easily log out from the system via the provided "logout" option in the dashboard sidebar.


> **Note**: All this can be tested as every option is provided on the Sidebar only according to the role of the user being logged in.