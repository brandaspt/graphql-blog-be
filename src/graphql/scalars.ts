import { DateTimeResolver, EmailAddressResolver } from "graphql-scalars"
import { asNexusMethod } from "nexus"

export const dateTimeScalar = asNexusMethod(DateTimeResolver, "date")
export const emailScalar = asNexusMethod(EmailAddressResolver, "email")
