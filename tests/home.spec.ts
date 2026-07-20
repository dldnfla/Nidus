import { test, expect, Page } from '@playwright/test';

async function snap(page: Page, label: string) {
  await test.info().attach(label, { body: await page.screenshot(), contentType: 'image/png' });
}

test('tc_1019 | 홈 탭 진입', async ({ page }) => {
  await page.goto('/');
  await snap(page, '홈 탭 진입 화면');
  await expect(page.getByText('Nidus')).toBeVisible();
  await expect(page.getByText('오늘의 미션')).toBeVisible();
  await expect(page.getByText('장보기 리스트')).toBeVisible();
  await expect(page.getByText('투두리스트')).toBeVisible();
  await expect(page.getByText('메모')).toBeVisible();
});

test('tc_1020 | 오늘의 미션', async ({ page }) => {
  await page.goto('/');
  await snap(page, '오늘의 미션 영역 확인');
  await expect(page.getByText('오늘의 미션')).toBeVisible();
  await expect(page.getByText('완료됨')).toBeVisible();
});

test('tc_1000 | 항목 추가', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).first().click();
  await page.getByRole('textbox', { name: '추가할 물건' }).fill('테스트 항목');
  await page.locator('#shopCatSelect').selectOption('food');
  await page.getByRole('button', { name: '추가' }).click();
  await snap(page, '장보기 항목 추가 후 목록 반영 확인');
  await expect(page.getByText('테스트 항목')).toBeVisible();
});

test('tc_1001 | 항목 추가 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).first().click();
  await page.getByRole('textbox', { name: '추가할 물건' }).fill(' ');
  await snap(page, '공백 입력 - 추가 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_1002 | 항목 추가 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).first().click();
  await page.getByRole('textbox', { name: '추가할 물건' }).fill('!@#$%');
  await snap(page, '특수문자 입력 - 추가 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_1003 | 항목 추가 : 200자 초과 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).first().click();
  await page.getByRole('textbox', { name: '추가할 물건' }).fill('가'.repeat(201));
  await snap(page, '200자 초과 입력 - 에러 메시지 및 버튼 상태 확인');
  await expect(page.getByText('200자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_1021 | 항목 추가 - 카테고리', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).first().click();
  await page.getByRole('textbox', { name: '추가할 물건' }).fill('카테고리 테스트');
  await page.locator('#shopCatSelect').selectOption('care');
  await page.getByRole('button', { name: '추가' }).click();
  await snap(page, '카테고리 지정 후 항목 추가 확인');
  await expect(page.getByText('카테고리 테스트')).toBeVisible();
});

test('tc_1004 | 카테고리 칩', async ({ page }) => {
  await page.goto('/');
  await snap(page, '카테고리 칩 노출 확인');
  await expect(page.getByRole('button', { name: '전체' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: '식재료' })).toBeVisible();
  await expect(page.getByRole('button', { name: '생활용품' })).toBeVisible();
  await expect(page.getByRole('button', { name: '기타' }).first()).toBeVisible();
});

test('tc_1005 | 항목 완료 체크', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).first().click();
  await page.getByRole('textbox', { name: '추가할 물건' }).fill('완료 테스트');
  await page.getByRole('button', { name: '추가' }).click();
  await page.getByText('완료 테스트').locator('..').getByRole('checkbox').click();
  await snap(page, '체크 후 취소선 스타일 적용 확인');
  await expect(page.getByText('완료 테스트')).toHaveCSS('text-decoration-line', 'line-through');
});

test('tc_1006 | 항목 삭제', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).first().click();
  await page.getByRole('textbox', { name: '추가할 물건' }).fill('삭제 테스트');
  await page.getByRole('button', { name: '추가' }).click();
  await snap(page, '삭제 전 - 항목 존재 확인');
  await page.getByText('삭제 테스트').locator('..').getByRole('button').click();
  await snap(page, '삭제 후 - 항목 제거 확인');
  await expect(page.getByText('삭제 테스트')).not.toBeVisible();
});

test('tc_1007 | 투두 항목 추가', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: '오늘 할 일' }).fill('투두 테스트');
  await page.getByRole('button', { name: '추가' }).nth(1).click();
  await snap(page, '투두 항목 추가 후 목록 반영 확인');
  await expect(page.getByText('투두 테스트')).toBeVisible();
});

test('tc_1008 | 투두 항목 추가 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: '오늘 할 일' }).fill(' ');
  await snap(page, '공백 입력 - 추가 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '추가' }).nth(1)).toBeDisabled();
});

test('tc_1009 | 투두 항목 추가 : 특수 문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: '오늘 할 일' }).fill('!@#$%');
  await snap(page, '특수문자 입력 - 추가 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '추가' }).nth(1)).toBeDisabled();
});

test('tc_1010 | 투두 항목 추가 : 200자 초과 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: '오늘 할 일' }).fill('가'.repeat(201));
  await snap(page, '200자 초과 입력 - 에러 메시지 및 버튼 상태 확인');
  await expect(page.getByText('200자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '추가' }).nth(1)).toBeDisabled();
});

test('tc_1011 | 투두 항목 완료 체크', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: '오늘 할 일' }).fill('완료 체크 테스트');
  await page.getByRole('button', { name: '추가' }).nth(1).click();
  await page.getByText('완료 체크 테스트').locator('..').getByRole('checkbox').click();
  await snap(page, '체크 후 취소선 스타일 적용 확인');
  await expect(page.getByText('완료 체크 테스트')).toHaveCSS('text-decoration-line', 'line-through');
});

test('tc_1012 | 투두 항목 삭제', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: '오늘 할 일' }).fill('삭제 테스트');
  await page.getByRole('button', { name: '추가' }).nth(1).click();
  await snap(page, '삭제 전 - 항목 존재 확인');
  await page.getByText('삭제 테스트').locator('..').getByRole('button').click();
  await snap(page, '삭제 후 - 항목 제거 확인');
  await expect(page.getByText('삭제 테스트')).not.toBeVisible();
});

test('tc_1013 | 메모 추가', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).nth(2).click();
  await page.getByRole('textbox').fill('테스트 메모입니다');
  await page.getByRole('button', { name: '보내기' }).click();
  await snap(page, '메모 추가 후 목록 반영 확인');
  await expect(page.getByText('테스트 메모입니다')).toBeVisible();
});

test('tc_1014 | 메모 추가 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).nth(2).click();
  await page.getByRole('textbox').fill(' ');
  await snap(page, '공백 입력 - 보내기 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '보내기' })).toBeDisabled();
});

test('tc_1015 | 메모 추가 : 500자 초과 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).nth(2).click();
  await page.getByRole('textbox').fill('가'.repeat(501));
  await snap(page, '500자 초과 입력 - 에러 메시지 및 버튼 상태 확인');
  await expect(page.getByText('500자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '보내기' })).toBeDisabled();
});

test('tc_1016 | 메모 추가 : URL 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).nth(2).click();
  await page.getByRole('textbox').fill('https://www.naver.com');
  await page.getByRole('button', { name: '보내기' }).click();
  await snap(page, 'URL 입력 후 자동 링크 처리 확인');
  await expect(page.getByText('https://www.naver.com')).toBeVisible();
});

test('tc_1017 | 메모 추가 : URL 입력 - URL 클릭', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).nth(2).click();
  await page.getByRole('textbox').fill('https://www.naver.com');
  await page.getByRole('button', { name: '보내기' }).click();
  await snap(page, 'URL 클릭 전 - 링크 노출 확인');
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByText('https://www.naver.com').click(),
  ]);
  await expect(newPage).toHaveURL(/naver\.com/);
});

test('tc_1018 | 메모 삭제', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+' }).nth(2).click();
  await page.getByRole('textbox').fill('삭제할 메모');
  await page.getByRole('button', { name: '보내기' }).click();
  await snap(page, '삭제 전 - 메모 존재 확인');
  await page.getByText('삭제할 메모').locator('..').getByRole('button').click();
  await snap(page, '삭제 후 - 메모 제거 확인');
  await expect(page.getByText('삭제할 메모')).not.toBeVisible();
});