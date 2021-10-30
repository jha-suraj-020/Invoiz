import {  Col, Container, Row } from 'react-bootstrap'
import './ProdCard.css'

function ProdCard(item) {
    console.log(item)
    return (
        <div className="prodcard">
            <img src={item.imgurl} alt={item.name}/>
            <div className="prodcard-details">
                <Container>
                    <Row>
                        <Col>Name: {item.name}</Col>

                        <Col>Unit: {item.unit}</Col>

                        <Col>Quantity: {item.quantity}</Col>

                        <Col>Price: {item.price}</Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default ProdCard
