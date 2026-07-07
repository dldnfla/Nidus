import { test, expect } from '@playwright/test';

//투표


test('tc_2000 | 투표 탭 진입', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await expect(page.getByText('우리 집 투표')).toBeVisible();
});

test('tc_2001 | 투표 생성', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await expect(page.getByText('새 투표 만들기')).toBeVisible();
  await expect(page.getByPlaceholder('질문을 입력해주세요')).toBeVisible();
  await expect(page.getByPlaceholder('선택지 1')).toBeVisible();
  await expect(page.getByPlaceholder('선택지 2')).toBeVisible();
  await expect(page.getByText('+ 선택지 추가')).toBeVisible();
  await expect(page.getByRole('button', { name: '취소' })).toBeVisible();
  await expect(page.getByRole('button', { name: '만들기' })).toBeVisible();
});

test('tc_2002 | 투표 생성 - 질문', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('테스트 질문');
  await expect(page.getByPlaceholder('질문을 입력해주세요')).toHaveValue('테스트 질문');
});

test('tc_2003 | 투표 생성 - 질문 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill(' ');
  await page.getByRole('button', { name: '만들기' }).click();
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2016 | 투표 생성 - 질문 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('!@#$%');
  await page.getByRole('button', { name: '만들기' }).click();
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2004 | 투표 생성 - 질문 : 200자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('가'.repeat(201));
  await expect(page.getByText('200자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2005 | 투표 생성 - 선택지 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('테스트 질문');
  await page.getByPlaceholder('선택지 1').fill(' ');
  await page.getByRole('button', { name: '만들기' }).click();
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2017 | 투표 생성 - 선택지 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('테스트 질문');
  await page.getByPlaceholder('선택지 1').fill('!@#$%');
  await page.getByRole('button', { name: '만들기' }).click();
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2006 | 투표 생성 - 선택지 : 200자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('선택지 1').fill('가'.repeat(201));
  await expect(page.getByText('200자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2018 | 투표 생성 - 선택지 - 1개만 입력 후 생성', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('테스트 질문');
  await page.getByPlaceholder('선택지 1').fill('선택지 하나');
  await page.getByRole('button', { name: '만들기' }).click();
  await expect(page.getByText('선택지를 2개 이상 입력해줘!')).toBeVisible();
});

test('tc_2008 | 투표 생성 - 선택지 추가 : 추가 가능 갯수 초과', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  // 최대 갯수까지 선택지 추가
  for (let i = 0; i < 10; i++) {
    const addBtn = page.getByText('+ 선택지 추가');
    if (await addBtn.isVisible()) {
      await addBtn.click();
    } else {
      break;
    }
  }
  await expect(page.getByText('+ 선택지 추가')).not.toBeVisible();
});

test('tc_2010 | 투표 생성 - 취소', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('취소 테스트');
  await page.getByRole('button', { name: '취소' }).click();
  await expect(page.getByText('새 투표 만들기')).not.toBeVisible();
  await expect(page.getByText('취소 테스트')).not.toBeVisible();
});

test('tc_2011 | 투표 생성 - 만들기', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('만들기 테스트');
  await page.getByPlaceholder('선택지 1').fill('선택지 A');
  await page.getByPlaceholder('선택지 2').fill('선택지 B');
  await page.getByRole('button', { name: '만들기' }).click();
  await expect(page.getByText('새 투표 만들기')).not.toBeVisible();
  await expect(page.getByText('만들기 테스트')).toBeVisible();
});

test('tc_2012 | 투표 삭제', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('삭제할 투표');
  await page.getByPlaceholder('선택지 1').fill('선택지 A');
  await page.getByPlaceholder('선택지 2').fill('선택지 B');
  await page.getByRole('button', { name: '만들기' }).click();
  await page.getByText('삭제할 투표').locator('..').getByRole('button').click();
  await expect(page.getByText('삭제할 투표')).not.toBeVisible();
});

test('tc_2015 | 투표 중복 참여', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('중복 참여 테스트');
  await page.getByPlaceholder('선택지 1').fill('선택지 A');
  await page.getByPlaceholder('선택지 2').fill('선택지 B');
  await page.getByRole('button', { name: '만들기' }).click();
  await page.getByText('선택지 A').click();
  await page.getByText('선택지 B').click();
  await expect(page.getByText('선택지 B')).toHaveClass(/selected|active/);
});