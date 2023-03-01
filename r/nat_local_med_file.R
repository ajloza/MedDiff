# PACKAGES ----------------------------------------------------------------

library(tidyverse)
library(readxl)
library(janitor)

# READ IN DATA ------------------------------------------------------------

local <- read_excel("local_2_8_23.xlsx") %>%
  clean_names()

national <- read_excel("national_2_16_23.xlsx") %>%
  clean_names()


# FUNCTIONS ---------------------------------------------------------------

usort <- function(x) {
  y <- unique(x) %>%
    sort()
  y
}

# EXPLORE TABLES ----------------------------------------------------------
# Local -------------------------------------------------------------------
# // Sorted unique values for each variable ----

# local_drug_name (n=6160 or 6162)
loc_drug_name_dose <- usort(local$local_drug_name_with_dose)

# order_item (n=4158)
loc_order_item <- usort(local$orderable_item)

# dea_schedule
loc_dea_sched <- usort(local$dea_schedule)

# ordering_packages (n=25)
loc_ord_pack <- usort(local$ordering_package_s)

# va_classification (n=354)
loc_va_class <- usort(local$va_classification)

# non_form
loc_non_form <- usort(local$non_formulary_flag)

# // Inpt vs outpt medications ----

# DF of inpatient medications
loc_in <- local %>%
  filter(str_detect(ordering_package_s, c("Unit|IV")))

# DF of outpatient medications
loc_out <- local %>%
  filter(!str_detect(ordering_package_s, c("Unit|IV")))

# // VA classification ----
# Example structure: AA111
# No clear rationale behind assignment that I can discern, other than VT = vitamins and XA = supplies
# Does not correspond to national$product_identifier

# DF with new column w/ VA class character combinations
loc_expand_va_class <- local %>%
  mutate(va_class_aa = str_sub(
    local$va_classification,
    1, 2))

# Vector of unique values (n=33)
loc_va_class_aa <- usort(loc_expand_va_class$va_class_aa)

# First 10 rows within each class
loc_slice_va_class <- loc_expand_va_class %>%
  group_by(va_class_aa) %>%
  slice_head(n = 10)

# // Supplies ----
# n=1224
loc_supplies <- local %>%
  filter(str_detect(va_classification, "XA"))

# National ----------------------------------------------------------------
# // Sorted unique values for each variable ----

# national_formulary_flag
nat_form_flag <- usort(national$national_formulary_flag)

# drug_name_with_dose (n=21369, all unique)
nat_drug_name_dose <- usort(national$drug_name_with_dose)

# va_drug_print_name (n=20682)
nat_va_drug_print <- usort(national$va_drug_print_name)

# va_product_identifier (n=20688)
# X appears to correspond to most supplies, includes 10000 items
nat_prod_id <- usort(national$va_product_identifier)

# cs_fed_sched (n=8)
nat_cs_fed_sched <- usort(national$cs_federal_schedule)

# // VA product identified ----
# Example structure: A1111, except for X (XA111)
# All letters represented
# Letter assigned based on first letter in va_drug_print_name

# DF with new column w/ product ID letter
nat_expand_prod_id <- national %>%
  mutate(prod_id_a = str_sub(
    national$va_product_identifier, 1, 1))

# N for each letter
n_prod_id_char <- nat_expand_prod_id %>%
  count(prod_id_a)

# First 10 rows within each letter group
nat_slice_prod_id <- nat_expand_prod_id %>%
  group_by(prod_id_a) %>%
  slice_head(n = 10)

view(national %>%
  mutate(va_product_identifier = str_sub(va_product_identifier, 1, 1)) %>%
  group_by(va_product_identifier) %>%
  head())

# // Supplies ----
# n=9809
nat_supplies <- national %>%
  filter(str_detect(va_product_identifier, "X"))
