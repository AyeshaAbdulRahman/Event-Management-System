-- View for upcoming events with venue and organizer details
CREATE VIEW upcoming_events_view AS
SELECT 
    e.Event_Id,
    e.Event_Name,
    e.Event_Type,
    e.Date,
    v.Venue_Name,
    v.City,
    CONCAT(u.First_Name, ' ', u.Last_Name) as Organizer_Name,
    COUNT(p.Participant_Id) as Participant_Count,
    COALESCE(ep.Payment, 0) as Total_Revenue
FROM Events e
LEFT JOIN Venues v ON e.Venue_Id = v.Venue_Id
LEFT JOIN Clients c ON e.Client_Id = c.Client_Id
LEFT JOIN Users u ON c.User_Id = u.User_Id
LEFT JOIN Participants p ON e.Event_Id = p.Event_Id
LEFT JOIN event_payment ep ON e.Event_Id = ep.Event_Id
WHERE e.Date >= CURDATE()
GROUP BY e.Event_Id;

-- View for vendor performance metrics
CREATE VIEW vendor_performance_view AS
SELECT 
    v.Vendor_Id,
    v.Vendor_Name,
    COUNT(DISTINCT ev.Event_Id) as Total_Events,
    COUNT(s.Supply_Id) as Total_Supplies_Provided
FROM Vendors v
LEFT JOIN event_vendors ev ON v.Vendor_Id = ev.Vendor_Id
LEFT JOIN Supplies s ON ev.Vendor_Id = s.Vendor_Id
GROUP BY v.Vendor_Id;

-- View for event task status
CREATE VIEW event_tasks_status_view AS
SELECT 
    e.Event_Id,
    e.Event_Name,
    COUNT(t.Task_Id) as Total_Tasks,
    SUM(CASE WHEN t.Status = 'Completed' THEN 1 ELSE 0 END) as Completed_Tasks,
    ROUND((SUM(CASE WHEN t.Status = 'Completed' THEN 1 ELSE 0 END) / COUNT(t.Task_Id)) * 100, 2) as Completion_Percentage
FROM Events e
LEFT JOIN Tasks t ON e.Event_Id = t.Event_Id
GROUP BY e.Event_Id; 