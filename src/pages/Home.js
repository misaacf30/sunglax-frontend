import { Container, Typography } from "@mui/material";
import Hero from "../components/Hero";
import ShoppingList from "../components/ShoppingList";

export default function Home() {
    return (
        <main>
            <Container maxWidth="lg" disableGutters sx={{ minHeight: "80vh" }}>
                <Hero/>
                <ShoppingList/>
            </Container>
        </main>
    )
}