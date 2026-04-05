import { CreditSection } from "../components/CreditSection";
import { CreditItem } from "../components/CreditItem";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { LinkText } from "@/components/LinkText";

export const CreditsPage = () => {
    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header title="Creditos"></EntityDetailsLayout.Header>
            <EntityDetailsLayout.Content columns={1}>
                <EntityDetailsLayout.Column>
                    <PanelContainer>
                        <CreditSection title="Información" type="text">
                            <CreditItem type="div">
                                Gracias por usar Inventory App
                            </CreditItem>
                            <CreditItem type="div">
                                Desarrollado por{" "}
                                {
                                    <LinkText
                                        to="https://github.com/ArmandoEnrique1010K"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        ArmandoEnrique1010k
                                    </LinkText>
                                }
                            </CreditItem>
                            <CreditItem type="div">Version 1.0.0</CreditItem>
                            <CreditItem type="div">
                                Fecha de lanzamiento: 2026-04-08
                            </CreditItem>
                            <CreditItem type="div">
                                © {new Date().getFullYear()}
                            </CreditItem>
                        </CreditSection>
                    </PanelContainer>
                    <PanelContainer>
                        <CreditSection title="Tecnologías Frontend" type="list">
                            <CreditItem type="li" url="https://react.dev/">
                                React
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://reactrouter.com/"
                            >
                                React Router DOM
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://tailwindcss.com/"
                            >
                                TailwindCSS
                            </CreditItem>
                            <CreditItem type="li" url="https://redux.js.org/">
                                Redux
                            </CreditItem>
                            <CreditItem type="li" url="https://axios-http.com/">
                                Axios
                            </CreditItem>
                            <CreditItem type="li" url="https://zod.dev/">
                                Zod
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://react-hook-form.com/"
                            >
                                React Hook Form
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://react-query.tanstack.com/"
                            >
                                TanStack React Query
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://www.radix-ui.com/"
                            >
                                Radix UI
                            </CreditItem>
                            <CreditItem type="li" url="https://heroicons.com/">
                                Heroicons
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://www.npmjs.com/package/react-burger-menu"
                            >
                                React Burger Menu
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://www.npmjs.com/package/react-datepicker"
                            >
                                React Date Picker
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://www.npmjs.com/package/react-datetime-picker"
                            >
                                React DateTime Picker
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://www.npmjs.com/package/react-qr-code"
                            >
                                React QR Code
                            </CreditItem>

                            <CreditItem
                                type="li"
                                url="https://react-select.com/home"
                            >
                                React Select
                            </CreditItem>

                            <CreditItem
                                type="li"
                                url="https://sonner.emilkowal.ski/"
                            >
                                Sonner
                            </CreditItem>
                        </CreditSection>

                        <CreditSection title="Tecnologías Backend" type="list">
                            <CreditItem
                                type="li"
                                url="https://dev.mysql.com/doc/"
                            >
                                MySQL
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://spring.io/projects/spring-boot"
                            >
                                Spring Boot
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://projectlombok.org/"
                            >
                                Lombok
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://spring.io/projects/spring-data-jpa"
                            >
                                Spring Data JPA
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://spring.io/projects/spring-validation"
                            >
                                Spring Validation
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://spring.io/projects/spring-security"
                            >
                                Spring Security
                            </CreditItem>
                            <CreditItem
                                type="li"
                                url="https://github.com/jwtk/jjwt"
                            >
                                JJWT
                            </CreditItem>
                        </CreditSection>

                        <CreditSection
                            title="Backend como servicio"
                            type="list"
                        >
                            <CreditItem
                                type="li"
                                url="https://www.mailersend.com/"
                            >
                                Mailersend
                            </CreditItem>
                            <CreditItem type="li" url="https://cloudinary.com/">
                                Cloudinary
                            </CreditItem>
                        </CreditSection>

                        <CreditSection title="Recursos" type="list">
                            <CreditItem
                                type="li"
                                url="https://www.svgrepo.com/svg/269884/transportation-big"
                            >
                                Icono de Inventario de SVG Repo
                            </CreditItem>

                            <CreditItem
                                type="li"
                                url="https://www.flaticon.es/icono-gratis/imprenta_9414966?term=imprenta&page=1&position=20&origin=tag&related_id=9414966"
                            >
                                Icono de imprenta creado por Paul J., de
                                Flaticon
                            </CreditItem>

                            <CreditItem
                                type="li"
                                url="https://fonts.google.com/specimen/Zalando+Sans"
                            >
                                Fuente de Google Fonts, autor Zalando Sans
                            </CreditItem>

                            <CreditItem
                                type="li"
                                url="https://cssloaders.github.io/"
                            >
                                Loader obtenido de CSS Loaders
                            </CreditItem>
                        </CreditSection>
                    </PanelContainer>
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
        </EntityDetailsLayout>
    );
};

// NUEVO LOGOTIPO DE LA EMPRESA
// https://www.svgrepo.com/svg/269884/transportation-big
