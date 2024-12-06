
DELIMITER //
CREATE TRIGGER before_event_delete
BEFORE DELETE ON Events
FOR EACH ROW
BEGIN
    DELETE FROM event_payment WHERE Event_Id = OLD.Event_Id;
    DELETE FROM event_vendors WHERE Event_Id = OLD.Event_Id;
    DELETE FROM participants WHERE Event_Id = OLD.Event_Id;
END//


CREATE TRIGGER after_payment_insert
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
    UPDATE event_payment
    SET Payment = Payment + NEW.Amount
    WHERE Event_Id = (
        SELECT Event_Id 
        FROM participants 
        WHERE Participant_Id = NEW.Participant_Id
    );
END//

DELIMITER ; 