import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaUserPlus,
  FaComments,
} from "react-icons/fa";
import "./Dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function Dashboard() {
  const DataGraficoLinha = [
    { name: "Jan", vendas1: 500, vendas2: 2000 },
    { name: "Fev", vendas1: 2000, vendas2: 1000 },
    { name: "Jan", vendas1: 500, vendas2: 2000 },
    { name: "Fev", vendas1: 2000, vendas2: 1000 },
    { name: "Jan", vendas1: 500, vendas2: 2000 },
    { name: "Fev", vendas1: 2000, vendas2: 1000 },
    { name: "Jan", vendas1: 500, vendas2: 2000 },
    { name: "Fev", vendas1: 2000, vendas2: 1000 },
  ];
  const DataGraficoBarra = [
    { name: "Jan", vendas: 4000 },
    { name: "Fev", vendas: 3000 },
    { name: "Mar", vendas: 2000 },
    { name: "Abr", vendas: 2780 },
    { name: "Mai", vendas: 1890 },
    { name: "Jun", vendas: 2390 },
    { name: "Jul", vendas: 3490 },
  ];
  const DataPizza = [
    { name: "Serviços", value: 400 },
    { name: "Produtos", value: 300 },
    { name: "Consultas", value: 300 },
    { name: "Outros", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div>
      <Container fluid className="mt-3 container-dashboard">
        <Row className="mb-4 row-dashboard justify-content-center">
          <Col xs={12} sm={6} md={2}>
            <Card className="card-dashboard">
              <Card.Body className="card-body-dashboard">
                <Card.Title>Comparecimento</Card.Title>
                <Card.Text className="d-flex justify-content-between align-items-center">
                  <span>60</span>
                  <FaCheckCircle color="#ffff" size={24} />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Card className="card-dashboard">
              <Card.Body className="card-body-dashboard">
                <Card.Title>Agendamento</Card.Title>
                <Card.Text className="d-flex justify-content-between align-items-center">
                  <span>14</span>
                  <FaCalendarAlt color="#ffff" size={27} />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Card className="card-dashboard">
              <Card.Body className="card-body-dashboard">
                <Card.Title>Novos Clientes</Card.Title>
                <Card.Text className="d-flex justify-content-between align-items-center">
                  <span>32</span>
                  <FaUserPlus color="#ffff" size={24} />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Card className="card-dashboard">
              <Card.Body className="card-body-dashboard">
                <Card.Title>Feedbacks</Card.Title>
                <Card.Text className="d-flex justify-content-between align-items-center">
                  <span>89</span>
                  <FaComments color="#ffff" size={24} />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="row-dashboard-grafico justify-content-center">
          <Col xs={12} md={5}>
            <Card className="mb-4 border-0">
              <Card.Body className="card-body-dashboard">
                <Card.Title>Distribuição de Serviços</Card.Title>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={DataPizza}
                      cx="50%"
                      cy="85%"
                      startAngle={180}
                      endAngle={0}
                      outerRadius={170}
                      fill="#8884d2"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {DataPizza.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={5}>
            <Card className="mb-4 border-0">
              <Card.Body>
                <Card.Title>Vendas Mensais</Card.Title>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={DataGraficoLinha}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="vendas1" stroke="#8884d8" />
                    <Line type="monotone" dataKey="vendas2" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="row-dashboard-grafico justify-content-center">
          <Col xs={12} md={11}>
            <Card className="mb-4 border-0">
              <Card.Body>
                <Card.Title>Vendas Mensais - Gráfico de Barras</Card.Title>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={DataGraficoBarra}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vendas" fill="#82ca9d" />
                  </BarChart>
                  <div className="radio-inputs">
                    <label className="radio">
                      <input
                        type="radio"
                        name="radio"
                        value="mensal"
                        onChange={() => handleChange("mensal")}
                      />
                      <span className="name">Mensal</span>
                    </label>

                    <label className="radio">
                      <input
                        type="radio"
                        name="radio"
                        value="trimestral"
                        onChange={() => handleChange("trimestral")}
                      />
                      <span className="name">Semanal</span>
                    </label>
                  </div>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
