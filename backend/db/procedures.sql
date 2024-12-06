DELIMITER //

-- Procedure to assign vendors to an event with their supplies
CREATE PROCEDURE assign_vendor_to_event(
    IN p_event_id INT,
    IN p_vendor_id INT,
    IN p_items JSON
)
BEGIN
    -- Insert vendor assignment
    INSERT INTO event_vendors (Event_Id, Vendor_Id) 
    VALUES (p_event_id, p_vendor_id);
    
    -- Insert supplies for each item
    INSERT INTO Supplies (Event_Id, Vendor_Id, Item_Name, Quantity)
    SELECT 
        p_event_id,
        p_vendor_id,
        JSON_UNQUOTE(JSON_EXTRACT(item, '$.name')),
        JSON_EXTRACT(item, '$.quantity')
    FROM JSON_TABLE(p_items, '$[*]' COLUMNS (
        item JSON PATH '$'
    )) AS items;
END//

-- Procedure to generate event summary
CREATE PROCEDURE get_event_summary(
    IN p_event_id INT
)
BEGIN
    SELECT 
        e.Event_Name,
        e.Event_Type,
        e.Date,
        v.Venue_Name,
        COUNT(DISTINCT p.Participant_Id) as Total_Participants,
        COUNT(DISTINCT ev.Vendor_Id) as Total_Vendors,
        COALESCE(ep.Payment, 0) as Total_Revenue,
        COUNT(DISTINCT t.Task_Id) as Total_Tasks,
        SUM(CASE WHEN t.Status = 'Completed' THEN 1 ELSE 0 END) as Completed_Tasks
    FROM Events e
    LEFT JOIN Venues v ON e.Venue_Id = v.Venue_Id
    LEFT JOIN Participants p ON e.Event_Id = p.Event_Id
    LEFT JOIN event_vendors ev ON e.Event_Id = ev.Event_Id
    LEFT JOIN event_payment ep ON e.Event_Id = ep.Event_Id
    LEFT JOIN Tasks t ON e.Event_Id = t.Event_Id
    WHERE e.Event_Id = p_event_id
    GROUP BY e.Event_Id;
END//

-- Procedure to update event status based on task completion
CREATE PROCEDURE update_event_status(
    IN p_event_id INT
)
BEGIN
    DECLARE total_tasks INT;
    DECLARE completed_tasks INT;
    
    SELECT 
        COUNT(*),
        SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END)
    INTO total_tasks, completed_tasks
    FROM Tasks
    WHERE Event_Id = p_event_id;
    
    IF completed_tasks = total_tasks THEN
        UPDATE Events 
        SET Status = 'Completed'
        WHERE Event_Id = p_event_id;
    ELSE
        UPDATE Events
        SET Status = 'In Progress'
        WHERE Event_Id = p_event_id;
    END IF;
END//

DELIMITER ; 