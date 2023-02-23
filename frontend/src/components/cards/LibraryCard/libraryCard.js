import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ToggleButton from 'react-bootstrap/ToggleButton';



function BasicExample() {

const [checked, setChecked] = useState(false);

  return (
  
    <Card style={{ width: '18rem' }}>
    <Card bg="primary" text="white">
      <Card.Body>
        <Card.Title>TressJS</Card.Title>
        <Card.Text>
        &#60; 2.13
        </Card.Text>
      </Card.Body> 
      </Card>
      <Card.Body>
        <Card.Text>
          Registered
        </Card.Text>
        <Card.Text>
          August / 12 / 2022
        </Card.Text>
          <ToggleButton
            className="mb-2"
            id="toggle-check"
            type="checkbox"
            variant="outline-primary"
            checked={checked}
            value="1"
            onChange={(e) => setChecked(e.currentTarget.checked)} >
          Checked
        </ToggleButton>
      </Card.Body>
    </Card>
  );
}

export default BasicExample;